const { Server } = require("socket.io");
const { createServer } = require("http");
const dotenv = require("dotenv");
dotenv.config();

const dbconfig = require("./config/dbConfig");
const app = require("./app");
const Message = require("./models/messagemodel"); // Import Message Model

const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Update this in production!)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

const users = {}; // Store active users
const activeChats = {}; // Track which chat each user is currently viewing

io.on("connection", (socket) => {
  console.log(` New User Connected with Socket ID: ${socket.id}`);

  // Retrieve userId from handshake query
  const userId = socket.handshake.query.userId;
  console.log(` Received userId from frontend: ${userId}`);

  if (userId && userId !== "undefined") {
    users[userId] = socket.id; // Map userId to socket ID
    console.log(` User ${userId} is online with Socket ID: ${socket.id}`);
  
    // Handle user connection
    socket.on("join", async ({ userId }) => {
      try {
        users[userId] = socket.id;
        console.log(`👋 User ${userId} connected with socket ${socket.id}`);

        // Find all undelivered messages for this user
        const undeliveredMessages = await Message.find({
          recipient: userId,
          status: "sent"
        });

        if (undeliveredMessages.length > 0) {
          console.log(`📬 Found ${undeliveredMessages.length} undelivered messages for user ${userId}`);
        
          const currentTime = new Date();
        
          // Mark messages as delivered
          await Message.updateMany(
            { _id: { $in: undeliveredMessages.map(msg => msg._id) } },
            { 
              status: "delivered",
              deliveredAt: currentTime
            }
          );

          // Group messages by sender and notify them
          const senderGroups = {};
          undeliveredMessages.forEach(msg => {
            const senderId = msg.sender.toString();
            if (!senderGroups[senderId]) {
              senderGroups[senderId] = [];
            }
            senderGroups[senderId].push({
              messageId: msg._id,
              chatId: msg.chatId
            });
          });

          // Notify each sender about their delivered messages
          Object.entries(senderGroups).forEach(([senderId, messages]) => {
            if (users[senderId]) {
              messages.forEach(({ messageId, chatId }) => {
                io.to(users[senderId]).emit("messageDelivered", {
                  messageId,
                  chatId,
                  status: "delivered",
                  timestamp: currentTime
                });
              });
            }
          });
        }
      } catch (error) {
        console.error("❌ Error handling user connection:", error);
      }
    });

    socket.on("joinChat", async ({ userId, chatId }) => {
      try {
        if (!userId || !chatId) {
          socket.emit("error", {
            type: "JOIN_CHAT_ERROR",
            message: "Missing userId or chatId"
          });
          return;
        }

        // Update active chat for user
        activeChats[userId] = chatId;
        console.log(`👀 User ${userId} joined chat ${chatId}`);

        // Get chat history
        const messages = await Message.find({ chatId })
          .sort({ createdAt: 1 });

        // Format messages for client
        const formattedMessages = messages.map(msg => ({
          _id: msg._id,
          senderId: msg.sender,
          message: msg.text,
          status: msg.status,
          timestamp: msg.createdAt,
          chatId: msg.chatId,
          deliveredAt: msg.deliveredAt,
          readAt: msg.readAt
        }));

        // Send chat history to user
        socket.emit("chatHistory", formattedMessages);
        console.log(`📚 Sending ${formattedMessages.length} messages to user ${userId}`);

        // Find unread messages sent by others
        const unreadMessages = messages.filter(
          msg => msg.recipient.toString() === userId && 
          msg.status !== "read" &&
          msg.sender.toString() !== userId
        );

        if (unreadMessages.length > 0) {
          const currentTime = new Date();
          console.log(`📬 Found ${unreadMessages.length} unread messages in chat ${chatId}`);
        
          // Mark messages as read
          const messageIds = unreadMessages.map(msg => msg._id);
          await Message.updateMany(
            { _id: { $in: messageIds } },
            { 
              status: "read",
              readAt: currentTime
            }
          );

          // Group messages by sender
          const senderGroups = {};
          unreadMessages.forEach(msg => {
            const senderId = msg.sender.toString();
            if (!senderGroups[senderId]) {
              senderGroups[senderId] = [];
            }
            senderGroups[senderId].push(msg._id);
          });

          // Notify each sender about their read messages
          Object.entries(senderGroups).forEach(([senderId, messageIds]) => {
            if (users[senderId]) {
              io.to(users[senderId]).emit("messagesRead", {
                messageIds,
                chatId,
                status: "read",
                timestamp: currentTime
              });
            }
          });
        }
      } catch (error) {
        console.error("❌ Error joining chat:", error);
        socket.emit("error", {
          type: "JOIN_CHAT_ERROR",
          message: "Failed to join chat"
        });
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message, chatId }) => {
      console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);
  
      if (!senderId || !receiverId || !message || !chatId) {
        console.error("❌ Missing required message fields:", { senderId, receiverId, message, chatId });
        return;
      }
  
      try {
        const currentTime = new Date();
      
        // Create new message with initial sent status
        const newMessage = new Message({
          sender: senderId,
          recipient: receiverId,
          text: message,
          chatId: chatId,
          status: "sent",
          createdAt: currentTime
        });
  
        const savedMessage = await newMessage.save();
        console.log("✅ Message saved successfully!");
  
        const messageData = {
          _id: savedMessage._id,
          senderId: savedMessage.sender,
          message: savedMessage.text,
          status: "sent",
          timestamp: currentTime,
          chatId: savedMessage.chatId
        };

        // Confirm to sender that message was sent
        socket.emit("messageSent", messageData);
  
        const receiverSocketId = users[receiverId];
        if (receiverSocketId) {
          // Update status to delivered since receiver is online
          await Message.findByIdAndUpdate(savedMessage._id, { 
            status: "delivered",
            deliveredAt: currentTime
          });
        
          messageData.status = "delivered";
          messageData.deliveredAt = currentTime;

          // Send to receiver
          io.to(receiverSocketId).emit("receiveMessage", messageData);
  
          // Notify sender about delivery
          socket.emit("messageDelivered", {
            messageId: savedMessage._id,
            chatId,
            status: "delivered",
            timestamp: currentTime
          });
  
          // If receiver is viewing this chat, mark as read immediately
          if (activeChats[receiverId] === chatId) {
            await Message.findByIdAndUpdate(savedMessage._id, { 
              status: "read",
              readAt: currentTime
            });
          
            messageData.status = "read";
            messageData.readAt = currentTime;
  
            // Send updated message to receiver
            io.to(receiverSocketId).emit("receiveMessage", messageData);
  
            // Notify sender about read status
            socket.emit("messageRead", {
              messageId: savedMessage._id,
              chatId,
              status: "read",
              timestamp: currentTime
            });
  
            console.log(`👀 Message ${savedMessage._id} marked as read immediately`);
          }
        }
      } catch (error) {
        console.error("❌ Error saving message:", error);
        socket.emit("error", {
          type: "SEND_MESSAGE_ERROR",
          message: "Failed to send message"
        });
      }
    });

    // Handle marking messages as read
    socket.on("markAsRead", async ({ messageIds, chatId, senderId }) => {
      try {
        if (!messageIds?.length || !chatId || !senderId) {
          console.error("❌ markAsRead event missing required fields");
          return;
        }

        const currentTime = new Date();

        // Update messages to read status
        await Message.updateMany(
          { 
            _id: { $in: messageIds },
            status: { $ne: "read" }
          },
          { 
            status: "read",
            readAt: currentTime
          }
        );

        // Notify sender about read status
        if (users[senderId]) {
          io.to(users[senderId]).emit("messagesRead", {
            messageIds,
            chatId,
            status: "read",
            timestamp: currentTime
          });
        }

        console.log(`✅ Marked ${messageIds.length} messages as read in chat ${chatId}`);
      } catch (error) {
        console.error("❌ Error updating message status:", error);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      const userId = Object.keys(users).find(key => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        delete activeChats[userId];
        console.log(`👋 User ${userId} disconnected`);
      }
    });
  } else {
    console.warn(` No valid userId received at connection from socket ${socket.id}`);
  }
});

// Function to Send Offline Messages When User Comes Online
const sendOfflineMessages = async (userId, socket) => {
  try {
    const undeliveredMessages = await Message.find({
      recipient: userId,
      status: "sent",
    });

    if (undeliveredMessages.length > 0) {
      undeliveredMessages.forEach(async (msg) => {
        console.log(` Preparing to send offline message ${msg._id} to ${userId}`);

        const messageData = {
          _id: msg._id,
          senderId: msg.sender,
          message: msg.text,
          status: "delivered",
        };

        console.log(" Emitting 'receiveMessage' with data:", messageData);

        socket.emit("receiveMessage", messageData);

        await Message.findByIdAndUpdate(msg._id, { status: "delivered" });

        console.log(` Updated message ${msg._id} to "delivered"`);
      });
    } else {
      console.log(` No offline messages for user ${userId}`);
    }
  } catch (error) {
    console.error(" Error sending offline messages:", error);
  }
};

// Start Server
server.listen(port, () => {
  console.log(` Server running on port: ${port}`);
});

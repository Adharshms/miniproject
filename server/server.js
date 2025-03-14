const { Server } = require("socket.io");
const { createServer } = require("http");
const dotenv = require("dotenv");
dotenv.config();

const dbconfig = require("./config/dbConfig");
const app = require("./app");
const Message = require("./models/messagemodel"); // ✅ Import Message Model

const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Update this in production!)
    methods: ["GET", "POST"],
  },
});

const users = {}; // ✅ Store active users

io.on("connection", (socket) => {
  console.log(`✅ New User Connected with Socket ID: ${socket.id}`);

  // ✅ Retrieve userId from handshake query
  const userId = socket.handshake.query.userId;
  console.log(`🔹 Received userId from frontend: ${userId}`);

  if (userId && userId !== "undefined") {
    users[userId] = socket.id; // ✅ Map userId to socket ID
    console.log(`🟢 User ${userId} is online with Socket ID: ${socket.id}`);
  } else {
    console.warn(`⚠ No valid userId received at connection from socket ${socket.id}`);
  }

  // ✅ Handle 'join' event separately
  socket.on("join", (userId) => {
    console.log(`🔹 Received 'join' event with userId:`, userId);
  
    if (!userId || userId === "undefined") {
      console.warn(`⚠ Received undefined userId from socket ${socket.id}`);
      return;
    }

    users[userId] = socket.id;
    console.log(`🟢 User ${userId} is online with Socket ID: ${socket.id}`);
  });

  // ✅ Handle Sending Message
  socket.on("sendMessage", async ({ senderId, receiverId, message, chatId }) => {
    console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);

    if (!senderId || !receiverId || !message || !chatId) {
      console.error("❌ Missing required message fields:", { senderId, receiverId, message, chatId });
      return;
    }

    try {
      // ✅ Store message in MongoDB
      const newMessage = new Message({
        sender: senderId,
        recipient: receiverId,
        text: message,
        chatId: chatId,
      });

      await newMessage.save();
      console.log("✅ Message saved successfully!");

      // ✅ Send real-time message if receiver is online
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        console.log(`📨 Delivered message to ${receiverId}`);
      }
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  // ✅ Handle Disconnection
  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(users).find(key => users[key] === socket.id);
    if (disconnectedUser) {
      delete users[disconnectedUser]; // Remove user from active list
      console.log(`❌ User ${disconnectedUser} disconnected`);
      console.log(`📌 Active users after disconnection:`, users);
    }
  });
});

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});

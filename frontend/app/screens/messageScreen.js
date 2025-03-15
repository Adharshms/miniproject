import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getSocket } from "../../services/socket"; 

export default function ChatScreen() {
  const route = useRoute();
  const { contactName, selectedChatUserId, userId, chatId } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to update message status
  const updateMessageStatus = useCallback((messageId, newStatus, timestamp) => {
    console.log(`🔄 Updating message ${messageId} to ${newStatus} at ${timestamp}`);
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg =>
        msg._id === messageId
          ? { 
              ...msg, 
              status: newStatus,
              ...(newStatus === 'delivered' && { deliveredAt: timestamp }),
              ...(newStatus === 'read' && { readAt: timestamp })
            }
          : msg
      );
      console.log('Updated messages:', updatedMessages);
      return updatedMessages;
    });
  }, []);

  // Function to update multiple message statuses
  const updateMultipleMessageStatus = useCallback((messageIds, newStatus, timestamp) => {
    console.log(`🔄 Batch updating ${messageIds.length} messages to ${newStatus} at ${timestamp}`);
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg =>
        messageIds.includes(msg._id)
          ? { 
              ...msg, 
              status: newStatus,
              ...(newStatus === 'delivered' && { deliveredAt: timestamp }),
              ...(newStatus === 'read' && { readAt: timestamp })
            }
          : msg
      );
      console.log('Updated messages:', updatedMessages);
      return updatedMessages;
    });
  }, []);

  // Function to mark messages as read
  const markMessagesAsRead = useCallback((newMessages) => {
    const socket = getSocket();
    if (!socket || !newMessages?.length) return;

    const unreadMessages = newMessages.filter(
      msg => msg.senderId !== userId && msg.status !== "read"
    );

    if (unreadMessages.length > 0) {
      console.log(`📤 Marking ${unreadMessages.length} messages as read`);
      const messageIds = unreadMessages.map(msg => msg._id);
      socket.emit("markAsRead", {
        messageIds,
        chatId,
        senderId: unreadMessages[0].senderId
      });
    }
  }, [userId, chatId]);

  useEffect(() => {
    const socket = getSocket();
  
    if (socket) {
      // Join user's general socket room
      socket.emit("join", { userId });
      console.log(`🔌 Joined general socket room as user ${userId}`);

      // Join specific chat room
      socket.emit("joinChat", { userId, chatId });
      console.log(`📡 Joined chat ${chatId} as user ${userId}`);
  
      // Handle initial chat history
      socket.on("chatHistory", (chatMessages) => {
        console.log(`📚 Received ${chatMessages.length} messages:`, chatMessages);
        setMessages(chatMessages);
        setIsLoading(false);
        // Mark received messages as read
        markMessagesAsRead(chatMessages);
      });

      // Handle sent message confirmation
      socket.on("messageSent", (messageData) => {
        console.log("📤 Message sent confirmation:", messageData);
        updateMessageStatus(messageData._id, "sent", messageData.timestamp);
      });

      // Handle batch message delivery
      socket.on("messageDelivered", ({ messageId, status, timestamp }) => {
        console.log(`📬 Message ${messageId} delivered at ${timestamp}`);
        updateMessageStatus(messageId, status, timestamp);
      });

      // Listen for new messages
      socket.on("receiveMessage", (messageData) => {
        console.log("📩 Received new message:", messageData);
  
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(msg => msg._id === messageData._id);
          if (!messageExists) {
            const newMessages = [...prevMessages, messageData].sort((a, b) => {
              const timeA = a.timestamp ? new Date(a.timestamp) : new Date(0);
              const timeB = b.timestamp ? new Date(b.timestamp) : new Date(0);
              return timeA - timeB;
            });
            // Mark new messages as read if we're in the chat
            markMessagesAsRead([messageData]);
            return newMessages;
          }
          // Update existing message if status has changed
          if (messageExists && messageData.status !== prevMessages.find(msg => msg._id === messageData._id).status) {
            return prevMessages.map(msg => 
              msg._id === messageData._id ? { ...msg, ...messageData } : msg
            );
          }
          return prevMessages;
        });
      });
  
      // Handle message read status
      socket.on("messageRead", ({ messageId, status, timestamp }) => {
        console.log(`👀 Message ${messageId} read at ${timestamp}`);
        updateMessageStatus(messageId, status, timestamp);
      });

      // Handle batch read status updates
      socket.on("messagesRead", ({ messageIds, status, timestamp }) => {
        console.log(`👀 Batch marking messages as ${status}:`, messageIds);
        updateMultipleMessageStatus(messageIds, status, timestamp);
      });

      // Handle errors
      socket.on("error", ({ type, message }) => {
        console.error(`❌ Socket error: ${type}`, message);
        if (type === "JOIN_CHAT_ERROR") {
          setIsLoading(false);
        }
      });
    }
  
    return () => {
      if (socket) {
        socket.emit("leaveChat", { userId });
        socket.off("chatHistory");
        socket.off("messageSent");
        socket.off("messageDelivered");
        socket.off("receiveMessage");
        socket.off("messageRead");
        socket.off("messagesRead");
        socket.off("error");
      }
    };
  }, [chatId, userId, markMessagesAsRead, updateMessageStatus, updateMultipleMessageStatus]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (!userId || !selectedChatUserId || !chatId) {
      console.error("❌ Missing required fields for sending message");
      return;
    }

    const socket = getSocket();
    if (!socket?.connected) {
      console.error("❌ Socket not connected");
      return;
    }

    const tempId = Date.now().toString();
    const newMessage = {
      _id: tempId,
      senderId: userId,
      message: inputText,
      status: "sending",
      timestamp: new Date().toISOString(),
      chatId
    };

    // Add message to UI immediately with "sending" status
    setMessages(prev => {
      const newMessages = [...prev, newMessage].sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const timeB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return timeA - timeB;
      });
      return newMessages;
    });
    
    setInputText("");

    // Send message
    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: selectedChatUserId,
      message: inputText,
      chatId: chatId,
    });
  };

  const renderMessage = ({ item }) => {
    const isSentByMe = item.senderId === userId;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{item.message}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
            {isSentByMe && (
              <Text style={styles.statusText}>
                {item.status === "sending" ? "⌛" :
                 item.status === "sent" ? "🕐" : 
                 item.status === "delivered" ? "✅" : 
                 "👀"}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0084ff" />
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{contactName || "Unknown Contact"}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderMessage}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        inverted={false}
        extraData={messages.map(m => m.status).join(',')} // Force re-render on status changes
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  container: { 
    flex: 1, 
    backgroundColor: "#F9F9F9" 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd", 
    backgroundColor: "#007AFF" 
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  chatArea: { 
    flex: 1
  },
  chatContent: {
    padding: 10,
    paddingBottom: 20
  },
  messageContainer: { 
    marginVertical: 5,
    maxWidth: "80%"
  },
  messageContent: {
    padding: 10,
    borderRadius: 10
  },
  sentMessage: { 
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6"
  },
  receivedMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "#EAEAEA" 
  },
  messageText: { 
    fontSize: 16, 
    color: "#333",
    marginBottom: 4
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  timestamp: {
    fontSize: 11,
    color: "#666",
    marginRight: 5
  },
  statusText: { 
    fontSize: 12,
    color: "#555"
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 10,
    borderTopWidth: 1, 
    borderTopColor: "#ddd",
    backgroundColor: "#FFF"
  },
  input: { 
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5"
  },
  sendButton: { 
    marginLeft: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    opacity: 1
  },
  sendButtonDisabled: {
    opacity: 0.5
  }
};

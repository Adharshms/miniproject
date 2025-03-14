// import React, { useState, useEffect } from 'react';  // ✅ Add useEffect
// import { 
//   View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';  
// import { useRoute } from '@react-navigation/native';
// import { socket } from "../../services/socket";
// import { connectSocket,getSocket } from "../../services/socket"; // Import socket functions
// const defaultImage = require("../../assets/images/default-avatar.webp");



// export default function ChatScreen() {
//   const route = useRoute();
//   console.log("✅ Chat Screen Loaded");
//   const [chatUserId, setChatUserId] = useState(null);
//   const { contactName, selectedChatUserId, userId } = route.params || {};
  
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');

//   useEffect(() => {
//     console.log("✅ Chat Screen Loaded");
//     console.log("📌 route.params:", route.params);
//     console.log("📌 userId:", userId);
//     console.log("📌 selectedChatUserId:", selectedChatUserId);
   
//     if (selectedChatUserId) {
//       setChatUserId(selectedChatUserId); // ✅ Save to state
//     }
 
//     const socket = getSocket();

//     if (socket) {
//       console.log("📩 Listening for messages...");
//       socket.on("receiveMessage", (messageData) => {
//         console.log("📩 New message received:", messageData);
//         setMessages((prevMessages) => [...prevMessages, messageData]);
//       });
//     } else {
//       console.error("❌ Socket is undefined or not connected.");
//     }

//     return () => {
//       if (socket) {
//         socket.off("receiveMessage");
//       }
//     };
//   }, [selectedChatUserId]);

//   // const sendMessage = async ({ senderId, receiverId, message, chatId }) => {
//   //   console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);

//   // if (!senderId || !receiverId || !message || !chatId) {
//   //   console.error("❌ Missing required message fields:", { senderId, receiverId, message, chatId });
//   //   return;
//   // }
   
//   //   if (!inputText.trim()) return;

//   //   let storedUserId = userId;
//   //   if (!storedUserId) {
//   //     storedUserId = Platform.OS === "web"
//   //       ? localStorage.getItem("userId")
//   //       : await AsyncStorage.getItem("userId");
//   //   }

//   //   console.log("✅ Retrieved userId:", storedUserId);
//   //   console.log("✅ Selected Chat User ID:", selectedChatUserId);

//   //   if (!storedUserId || !selectedChatUserId) {
//   //     console.error("❌ senderId or receiverId is undefined.");
//   //     return;
//   //   }

//   //   const socket = getSocket();
//   //   if (!socket || !socket.connected) {
//   //     console.error("❌ Socket is not connected, cannot send message.");
//   //     return;
//   //   }

//   //   console.log(`📤 Sending message from ${storedUserId} to ${selectedChatUserId}: ${inputText}`);
    
//   //   socket.emit("sendMessage", {
//   //     senderId: storedUserId,
//   //     receiverId: selectedChatUserId,
//   //     message: inputText,
//   //   });

//   //   setMessages((prevMessages) => [
//   //     ...prevMessages,
//   //     { senderId: storedUserId, message: inputText },
//   //   ]);
    
//   //   setInputText("");
//   // };
//   const sendMessage = async () => {
//     if (!inputText.trim()) return;
  
//     let storedUserId = userId;
//     if (!storedUserId) {
//       storedUserId = Platform.OS === "web"
//         ? localStorage.getItem("userId")
//         : await AsyncStorage.getItem("userId");
//     }
  
//     console.log("✅ Retrieved userId:", storedUserId);
//     console.log("✅ Selected Chat User ID:", selectedChatUserId);
//     console.log("✅ Chat ID:", chatId);  // ✅ Log chatId to confirm it's available
  
//     if (!storedUserId || !selectedChatUserId || !chatId) {
//       console.error("❌ senderId, receiverId, or chatId is undefined.");
//       return;
//     }
  
//     const socket = getSocket();
//     if (!socket || !socket.connected) {
//       console.error("❌ Socket is not connected, cannot send message.");
//       return;
//     }
  
//     console.log(`📤 Sending message from ${storedUserId} to ${selectedChatUserId}: ${inputText}`);
  
//     socket.emit("sendMessage", {
//       senderId: storedUserId,
//       receiverId: selectedChatUserId,
//       message: inputText,
//       chatId: chatId, // ✅ Ensure chatId is included
//     });
  
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { senderId: storedUserId, message: inputText },
//     ]);
    
//     setInputText("");
//   };
  
//   return (
//     <View style={styles.container}>
//       {/* 🟢 Header Section */}
//       <View style={styles.header}>
//         <Image source={defaultImage} style={styles.profileImage} />
//         <View>
//           <Text style={styles.name}>{contactName || "Unknown Contact"}</Text>
//           <Text style={styles.status}>Online</Text>
//         </View>
//       </View>

//       {/* 🟢 Chat Messages */}
//       <FlatList
//         data={messages || []}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageContainer,
//             userId && item.senderId === userId ? styles.sentMessage : styles.receivedMessage
//           ]}>
//             <Text style={styles.messageText}>{item.message || ""}</Text>
//           </View>
//         )}
//         style={styles.chatArea}
//         contentContainerStyle={{ paddingBottom: 80 }}
//       />

//       {/* 🟢 Message Input Box */}
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             value={inputText}
//             onChangeText={setInputText}
//             multiline
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//             <Ionicons name="send" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F9F9F9' },

//   /* 🟢 HEADER */
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 15, 
//     borderBottomWidth: 1, 
//     borderBottomColor: '#ddd', 
//     backgroundColor: '#007AFF' 
//   },
//   profileImage: { 
//     width: 50, 
//     height: 50, 
//     borderRadius: 25, 
//     marginRight: 10 
//   },
//   name: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#fff' 
//   },
//   status: { 
//     fontSize: 14, 
//     color: 'lightgray' 
//   },

//   /* 🟢 CHAT AREA */
//   chatArea: { 
//     flex: 1, 
//     paddingHorizontal: 10 
//   },
//   messageContainer: { 
//     padding: 10, 
//     marginVertical: 5, 
//     borderRadius: 10, 
//     maxWidth: '75%' 
//   },
//   sentMessage: { 
//     alignSelf: 'flex-end', 
//     backgroundColor: '#DCF8C6' 
//   },
//   receivedMessage: { 
//     alignSelf: 'flex-start', 
//     backgroundColor: '#EAEAEA' 
//   },
//   messageText: { 
//     fontSize: 16, 
//     color: '#333' 
//   },

//   /* 🟢 INPUT BOX */
//   inputContainer: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 10, 
//     borderTopWidth: 1, 
//     borderTopColor: '#ddd', 
//     backgroundColor: '#FFF',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0 
//   },
//   input: { 
//     flex: 1, 
//     height: 40, 
//     borderColor: '#ccc', 
//     borderWidth: 1, 
//     borderRadius: 20, 
//     paddingHorizontal: 15, 
//     backgroundColor: '#F5F5F5' 
//   },
//   sendButton: { 
//     marginLeft: 10, 
//     backgroundColor: '#007AFF', 
//     padding: 10, 
//     borderRadius: 20 
//   }
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getSocket } from "../../services/socket"; // ✅ Import socket functions

export default function ChatScreen() {
  const route = useRoute();
  const { contactName, selectedChatUserId, userId, chatId } = route.params || {}; // ✅ Get chatId

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    console.log("✅ Chat Screen Loaded");
    console.log("📌 route.params:", route.params);
    console.log("📌 userId:", userId);
    console.log("📌 selectedChatUserId:", selectedChatUserId);
    console.log("📌 chatId:", chatId); // ✅ Ensure chatId is retrieved

    if (!chatId) {
      console.error("❌ chatId is missing in route params!");
      return;
    }

    const socket = getSocket();

    if (socket) {
      console.log("📩 Listening for messages...");
      socket.on("receiveMessage", (messageData) => {
        console.log("📩 New message received:", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });
    } else {
      console.error("❌ Socket is undefined or not connected.");
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    let storedUserId = userId;
    if (!storedUserId) {
      storedUserId =
        Platform.OS === "web"
          ? localStorage.getItem("userId")
          : await AsyncStorage.getItem("userId");
    }

    console.log("✅ Retrieved userId:", storedUserId);
    console.log("✅ Selected Chat User ID:", selectedChatUserId);
    console.log("✅ Chat ID:", chatId);

    if (!storedUserId || !selectedChatUserId || !chatId) {
      console.error("❌ senderId, receiverId, or chatId is undefined.");
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.error("❌ Socket is not connected, cannot send message.");
      return;
    }

    console.log(
      `📤 Sending message from ${storedUserId} to ${selectedChatUserId}: ${inputText}`
    );

    socket.emit("sendMessage", {
      senderId: storedUserId,
      receiverId: selectedChatUserId,
      message: inputText,
      chatId: chatId, // ✅ Ensure chatId is passed
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: storedUserId, message: inputText },
    ]);

    setInputText("");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{contactName || "Unknown Contact"}</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              userId && item.senderId === userId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message || ""}</Text>
          </View>
        )}
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Message Input Box */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd", backgroundColor: "#007AFF" },
  name: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  chatArea: { flex: 1, paddingHorizontal: 10 },
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "75%" },
  sentMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  receivedMessage: { alignSelf: "flex-start", backgroundColor: "#EAEAEA" },
  messageText: { fontSize: 16, color: "#333" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#FFF" },
  input: { flex: 1, height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, backgroundColor: "#F5F5F5" },
  sendButton: { marginLeft: 10, backgroundColor: "#007AFF", padding: 10, borderRadius: 20 },
};

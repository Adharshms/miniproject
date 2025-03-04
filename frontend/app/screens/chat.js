// import React, { useState } from 'react';
// import { 
//   View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';  
// import { useRoute } from '@react-navigation/native';

// export default function ChatScreen() {
//   const route = useRoute();
//   const { name, status, imageUrl } = route.params || {};
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');

//   const sendMessage = () => {
//     if (inputText.trim()) {
//       setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'You' }]);
//       setInputText('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Contact Info */}
//       <View style={styles.header}>
//         <Image source={{ uri: imageUrl }} style={styles.profileImage} />
//         <View>
//           <Text style={styles.name}>{name}</Text>
//           <Text style={styles.status}>{status}</Text>
//         </View>
//       </View>

//       {/* Chat Messages */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.messageBubble, item.sender === 'You' ? styles.sentMessage : styles.receivedMessage]}>
//             <Text style={styles.messageText}>{item.text}</Text>
//           </View>
//         )}
//         style={styles.chatArea}
//       />

//       {/* Input Box for Typing Messages */}
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             value={inputText}
//             onChangeText={setInputText}
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
//   container: { flex: 1, backgroundColor: '#FFF' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#F5F5F5' },
//   profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
//   name: { fontSize: 18, fontWeight: 'bold' },
//   status: { fontSize: 14, color: 'gray' },
//   chatArea: { flex: 1, padding: 10 },
//   messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: '70%' },
//   sentMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
//   receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#EAEAEA' },
//   messageText: { fontSize: 16 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#FFF' },
//   input: { flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15 },
//   sendButton: { marginLeft: 10, backgroundColor: '#007AFF', padding: 10, borderRadius: 20 },
// });
import React, { useState } from 'react';
import { 
  View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';  
import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  const route = useRoute();
  const { contactName } = route.params || {}; // Fix: Get contactName instead of name
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'You' }]);
      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Contact Info */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.profileImage} />
        <View>
          <Text style={styles.name}>{contactName || "Unknown Contact"}</Text> 
          <Text style={styles.status}></Text> {/* Default status, update dynamically if needed */}
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'You' ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.chatArea}
      />

      {/* Input Box for Typing Messages */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#F5F5F5' },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 14, color: 'gray' },
  chatArea: { flex: 1, padding: 10 },
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: '70%' },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#EAEAEA' },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#FFF' },
  input: { flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { marginLeft: 10, backgroundColor: '#007AFF', padding: 10, borderRadius: 20 },
});

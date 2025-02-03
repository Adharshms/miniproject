 // ChatScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const ChatScreen = () => {
  const [message, setMessage] = useState('');  // Store the current message typed
  const [messages, setMessages] = useState([]);  // Store all sent messages

  // Function to send message
  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length.toString(), text: message },  // Add message to the list
      ]);
      setMessage('');  // Clear input after sending
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: '#e74c3c',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default ChatScreen;

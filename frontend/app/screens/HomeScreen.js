import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';

export default function ContactList({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Store logged-in user's ID

  const API_BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'  // For Android Emulator
    : 'http://localhost:5000'; // For Web

  useFocusEffect(
    React.useCallback(() => {
      const fetchChats = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) {
            Alert.alert('Error', 'Authentication failed. Please login again.');
            navigation.replace('Auth');
            return;
          }

          // Decode token to extract userId
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
          setUserId(payload.userId);

  final
          const response = await fetch(`${API_BASE_URL}/api/chat/get-chat-of-user`, {
 
          const response = await fetch('http://192.168.37.66:5000/api/chat/get-chat-of-user', {
    main
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const text = await response.text();
          const data = JSON.parse(text);

          if (data.success) {
            setContacts(data.data || []);
          } else {
            Alert.alert('Error', data.message);
          }
        } catch (error) {
          console.error(" Error fetching contacts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchChats();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0F172A" style={{ marginTop: 50 }} />;
  }

  // Find the correct chat participant (exclude logged-in user)
  const filteredContacts = contacts.map(({ _id, members, unreadMessageCount }) => {
    if (!userId) return null;

    const otherMember = members.find(member => member._id !== userId);

    return (
      <TouchableOpacity
        key={_id}
        style={styles.userCard}
        // onPress={() => navigation.navigate('chat', { chatId: _id })}
        onPress={() => navigation.navigate('chat', { chatId: _id, contactName: otherMember?.name })}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/60' }}
          style={styles.userImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{otherMember?.name || "Unknown"}</Text>
          <Text style={styles.lastMessage}>
            {unreadMessageCount > 0 ? `Unread: ${unreadMessageCount}` : "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(text) => setSearchText(text)}
      />
      <Text style={styles.headingText}>Chats</Text>
      <ScrollView style={styles.Container}>
        {filteredContacts.length > 0 ? filteredContacts : <Text style={styles.noChats}>No chats available</Text>}
      </ScrollView>

      {/* Floating Add Contact Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingText: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 15 },
  Container: { paddingHorizontal: 16, marginBottom: 10 },
  userCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, backgroundColor: '#F5F5F5', paddingHorizontal: 7, borderRadius: 10, marginVertical: 5 },
  userImage: { height: 60, width: 60, borderRadius: 30, marginRight: 14 },
  textContainer: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600' },
  lastMessage: { fontSize: 13, color: 'gray' },
  searchInput: { height: 40, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, marginHorizontal: 16, marginVertical: 8, borderRadius: 5 },
  noChats: { textAlign: 'center', fontSize: 16, marginTop: 20, color: 'gray' },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: 'black', // Button color
    borderRadius: 30, // Circular shape
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

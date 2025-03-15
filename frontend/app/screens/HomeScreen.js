import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ContactList({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const API_BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'
    : 'http://localhost:5000';

  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication failed. Please login again.');
        navigation.replace('Auth');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);

      const response = await fetch(`${API_BASE_URL}/api/chat/get-chat-of-user`, {
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
      console.error("❌ Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0F172A" style={{ marginTop: 50 }} />;
  }

  const getInitialColor = (name) => {
    const colors = ['#4F46E5', '#7C3AED', '#DB2777', '#EA580C', '#059669'];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const filteredContacts = contacts.map(({ _id, members, unreadMessageCount }) => {
    if (!userId) return null;
    const otherMember = members.find(member => member._id !== userId);
    const name = otherMember?.name || "Unknown";
    const initial = name.charAt(0).toUpperCase();
    const backgroundColor = getInitialColor(name);

    return (
      <TouchableOpacity
        key={_id}
        style={styles.userCard}
        onPress={() => navigation.navigate('chat', { 
          selectedChatUserId: otherMember?._id,
          contactName: name,
          userId: userId,
          chatId: _id
        })} 
      >
        <View style={[styles.avatarContainer, { backgroundColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.lastMessage}>
            {unreadMessageCount > 0 ? `${unreadMessageCount} unread message${unreadMessageCount > 1 ? 's' : ''}` : "No new messages"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        placeholderTextColor="#94A3B8"
        onChangeText={setSearchText}
      />
      <Text style={styles.headingText}>Chats</Text>
      <ScrollView style={styles.scrollContainer}>
        {filteredContacts.length > 0 ? filteredContacts : 
          <Text style={styles.noChats}>No chats yet. Add contacts to start messaging!</Text>
        }
      </ScrollView>

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
    backgroundColor: '#F8FAFC'
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginVertical: 10,
    color: '#0F172A'
  },
  scrollContainer: {
    paddingHorizontal: 16
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  textContainer: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B'
  },
  searchInput: {
    height: 44,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  noChats: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginTop: 24
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#0F172A',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold'
  }
});

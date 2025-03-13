import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddContactScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication failed. Please login again.');
        navigation.replace('Auth');
        return;
      }

  final
      const response = await fetch('http://192.168.160.11:5000/api/chat/create-new-chat', {
 
      const response = await fetch('http://192.168.37.66:5000/api/chat/create-new-chat', {
  main
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Chat created successfully!');
        setEmail('');
        navigation.goBack(); // Navigate back to Contact List
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('❌ Error adding contact:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Contact</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact} disabled={loading}>
        <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  addButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    opacity: 0.9,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

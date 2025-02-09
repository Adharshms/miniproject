import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';

const HomeScreen = ({ navigation }) => {
  const auth = getAuth();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Chat App!</Text>
      <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
      
      {/* Add your chat functionality here */}
      <View style={styles.chatContainer}>
        <Text style={styles.chatText}>Your chats will appear here</Text>
      </View>
      
      <Button 
        title="Logout" 
        onPress={handleLogout} 
        color="#e74c3c"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
  },
  chatContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  chatText: {
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default HomeScreen;

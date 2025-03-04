import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from '@firebase/auth';

const WelcomeScreen = () => {
  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to XCROSS!</Text>
      <Text style={styles.emailText}>{userEmail}</Text>
      <Text style={styles.messageText}>Thank you for signing up.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    color: '#4A90E2',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default WelcomeScreen;

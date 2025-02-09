import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from '@firebase/auth';

const HomeScreen = ({ navigation }) => {
  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.emailText}>{userEmail}</Text>
        <Text style={styles.messageText}>
          You've successfully signed up for XCROSS.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  messageText: {
    fontSize: 18,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0F172A',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;

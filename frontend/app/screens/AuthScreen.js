import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && (!name || !language))) {
      setError('Please fill all fields');
      return;
    }

    const API_BASE_URL =
      Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

    const endpoint = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/signup`;

    const userData = isLogin
      ? { email, password }
      : { name, email, password, language };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          await AsyncStorage.setItem('authToken', data.token);
          await AsyncStorage.setItem('userId', data.userId);

          console.log(`🔹 User ID stored: ${data.userId}`);
          navigation.replace('Home');
        } else {
          Alert.alert('Signup Successful', 'Please log in to continue.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
          setLanguage('');
        }
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.authContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>XCROSS</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Welcome' : 'Create Account'}</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  autoCapitalize="words"
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  style={styles.input}
                  value={language}
                  onChangeText={setLanguage}
                  placeholder="Preferred Language"
                  autoCapitalize="words"
                  placeholderTextColor="#94A3B8"
                />
              </>
            )}

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity style={styles.button} onPress={handleAuth} activeOpacity={0.7}>
              <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
                setLanguage('');
              }}
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ✅ Add missing styles object
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  authContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 40, fontWeight: '700', color: '#0F172A', marginBottom: 8, letterSpacing: 3 },
  subtitle: { fontSize: 16, color: '#64748B', letterSpacing: 0.5 },
  formContainer: { width: '100%' },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#0F172A',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  button: {
    backgroundColor: '#0F172A',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  toggleContainer: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16, fontSize: 14 },
});

export default AuthScreen;

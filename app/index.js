import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@firebase/auth';
import SplashScreen from './SplashScreen';
import HomeScreen from './screens/HomeScreen';
import chat from './screens/chat';
import ContactList from './screens/HomeScreen';
import { sendPasswordResetEmail } from '@firebase/auth';
import { Alert } from 'react-native';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

const firebaseConfig = {
  apiKey: "AIzaSyDfNHDweBFakY466Xkd8h4Mb387pSEvagk",
  authDomain: "chatapp-2e7a7.firebaseapp.com",
  projectId: "chatapp-2e7a7",
  storageBucket: "chatapp-2e7a7.firebasestorage.app",
  messagingSenderId: "579472465047",
  appId: "1:579472465047:web:373a68c778afb72650ddd2",
  measurementId: "G-YZW27HDZ3G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Stack = createNativeStackNavigator();

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuthentication = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully!');
      }
      setEmail('');
      setPassword('');
      navigation.replace('Home');
    } catch (error) {
      console.error('Authentication error:', error.message);
      setError(error.message.replace('Firebase: ', ''));
    }

  };
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email to reset password');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'Check your email for the reset link.');
      setEmail('');
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.authContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>XCROSS</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Welcome' : 'Create Account'}</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#94A3B8"
            />
            {isLogin && (
              <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAuthentication}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
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



const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState('Auth');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setInitialRoute('Home');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="chat" component={chat} />
      <Stack.Screen name="Contacts" component={ContactList} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

    </Stack.Navigator>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <Navigation />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },

});

export default App;
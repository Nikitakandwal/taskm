import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading, isAuthenticated } = useContext(AuthContext);
  const [localError, setLocalError] = useState('');



  const getSignupError = (error) => {
    if (!error) return '';
     
    const errorMap = {
      'User already exists': 'This email is already registered',
      'Password must be at least 8 characters': 'Password must be at least 8 characters',
      'Password must contain letters and numbers': 'Password must contain both letters and numbers',
      'Invalid email format': 'Please enter a valid email address',
      'Name is required': 'Please enter your name',
      'Network Error': 'No internet connection. Please check your network.'
    }; 
    for (const [key, value] of Object.entries(errorMap)) {
      if (error.includes(key)) {
        return value;
      }
    }
  
    return 'Registration failed. Please try again.';
  };
 
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  const handleSignup = async () => {
    setLocalError('');
     
    if (!name.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }
  
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
  
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setLocalError('Password must contain both letters and numbers');
      return;
    }
  
    try {
      await register(name, email, password); 
    } catch (err) {
      console.log('Raw error:', err);
      const errorMessage = getSignupError(err.message || err);
      setLocalError(errorMessage);
      
      if (errorMessage.includes('already registered')) {
        setLocalError(
          `${errorMessage}\n\nDo you want to login instead?`
        );
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={{ colors: { primary: colors.primary } }}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        theme={{ colors: { primary: colors.primary } }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        theme={{ colors: { primary: colors.primary } }}
      />

      {localError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {localError.split('\n').map((line, i) => (
              <Text key={i}>
                {line}
                {i < localError.split('\n').length - 1 && '\n'}
              </Text>
            ))}
          </Text>
          {localError.includes('already registered') && (
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login', { email })}
              style={styles.errorAction}
            >
              Go to Login
            </Button>
          )}
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleSignup}
        style={[styles.button, { backgroundColor: colors.primary }]}
        loading={loading}
        disabled={loading}
        labelStyle={{ color: colors.onPrimary }}
      >
        Sign Up
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkContainer}
      >
        <Text style={[styles.link, { color: colors.primary }]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
  },
  errorContainer: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
  },
  errorContainer: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFEBEE', // Light red background
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F', // Dark red accent
  },
  errorText: {
    color: '#D32F2F',
    lineHeight: 20,
  },
  errorAction: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default SignupScreen;
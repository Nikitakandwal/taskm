import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import axios from 'axios';  
import { API_URL } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { tempToken } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { colors } = useTheme();
 
  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const getErrorMessage = (error) => { 
    if (error.message === 'Network Error') {
      return 'No internet connection. Please check your network and try again.';
    }
 
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return error.response.data.message || 'Invalid request. Please try again.';
        case 401:
          return 'This password reset link has expired. Please request a new one.';
        case 422:
          return error.response.data.message || 'Password does not meet requirements (min 8 characters with letters and numbers)';
        case 429:
          return 'Too many attempts. Please wait before trying again.';
        case 500:
          return 'Our servers are busy. Please try again in a few minutes.';
        default:
          return 'Failed to update password. Please try again.';
      }
    }
 
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection.';
    }
 
    return 'Something went wrong. Please try again.';
  };

  const handleReset = async () => { 
    setError('');
 
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setError('Password must contain both letters and numbers');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        tempToken,
        password
      });
       
      await AsyncStorage.setItem('token', response.data.token);
      navigation.replace('Home');
      
    } catch (err) {
      const userFriendlyError = getErrorMessage(err);
      setError(userFriendlyError);
       
      console.log('Reset password error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Create New Password
      </Text>
      
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Your new password must be different from previous passwords
      </Text>

      <TextInput
        label="New Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        theme={{ colors: { primary: colors.primary } }}
        placeholder="At least 8 characters with letters and numbers"
        autoComplete="password"
        textContentType="newPassword"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
        theme={{ colors: { primary: colors.primary } }}
        autoComplete="password"
        textContentType="newPassword"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.errorContainer }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      ) : null}

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        disabled={loading || !password || password !== confirmPassword}
        style={[styles.button, { backgroundColor: colors.primary }]}
        labelStyle={{ color: colors.onPrimary }}
        contentStyle={{ height: 48 }}
      >
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  errorContainer: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ResetPasswordScreen;
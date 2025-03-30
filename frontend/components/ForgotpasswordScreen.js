import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import axios from 'axios';

import { API_URL } from '../services/authService';
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { colors } = useTheme();

  const getErrorMessage = (error) => { 
    if (error.message === 'Network Error') {
      return 'Internet connection failed. Please check your network and try again.';
    }
 
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many attempts. Please wait 15 minutes before trying again.';
        case 500:
          return 'Our email service is temporarily unavailable. Please try again later.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }
 
    if (error.code === 'ECONNABORTED') {
      return 'Request took too long. Please check your connection and try again.';
    }
 
    return 'Failed to send OTP. Please try again.';
  };

  const handleSendOtp = async () => { 
    setError('');
     
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    setLoading(true);
  
    try {
      console.log('Attempting to send OTP to:', email);  
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
      
      console.log('OTP Response:', response.data);  
      
      if (response.data.success) {
        navigation.navigate('VerifyOtp', { 
          email, 
          sentAt: Date.now() 
        });
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.log('OTP Error:', { 
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      const serverMessage = err.response?.data?.message;
      const userFriendlyError = serverMessage || getErrorMessage(err);
      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Reset Your Password
      </Text>
      
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your email to receive a verification code
      </Text>

      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        theme={{ 
          colors: { 
            primary: colors.primary,
            background: colors.surface 
          } 
        }}
      />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSendOtp}
        loading={loading}
        disabled={loading}
        style={[styles.button, { backgroundColor: colors.primary }]}
        labelStyle={{ color: colors.onPrimary }}
        contentStyle={styles.buttonContent}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  errorContainer: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ForgotPasswordScreen;
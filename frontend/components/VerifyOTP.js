import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../services/authService';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp
      });
      navigation.navigate('ResetPassword', {
        tempToken: response.data.tempToken
      });
    } catch (err) {
        console
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Check your email for the 6-digit code</Text>
      
      <TextInput
        label="OTP Code"
        value={otp}
        onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        disabled={loading || otp.length !== 6}
        style={styles.button}
      >
        Verify OTP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default VerifyOtpScreen;
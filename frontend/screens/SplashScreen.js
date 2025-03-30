import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AuthContext from '../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  useEffect(() => { 
    const timer = setTimeout(() => {
      if (!isLoading) {
        navigation.replace(isAuthenticated ? 'Home' : 'Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Image 
        source={require('../assets/logo.jpg')} 
        style={styles.logo}
      />
      <Text style={[styles.title, { color: colors.onPrimary }]}>Task Manager</Text>
      <ActivityIndicator 
        size="large" 
        color={colors.onPrimary} 
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;
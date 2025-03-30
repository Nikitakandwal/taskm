import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useContext(AuthContext);
    const [localError, setLocalError] = useState('');

    const getLoginError = (error) => {
        if (error.includes('invalid credentials')) {
            return 'Incorrect email or password. Please try again.';
        }
        if (error.includes('network error')) {
            return 'Network connection failed. Check your internet.';
        }
        if (error.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        if (error.includes('too many requests')) {
            return 'Too many attempts. Please wait 5 minutes.';
        }
        return 'Login failed. Please try again.';
    };

    const handleLogin = async () => {
        setLocalError('');

        // Client-side validation
        if (!email.includes('@') || !email.includes('.')) {
            setLocalError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        const success = await login(email, password);
        if (success) {
            navigation.replace('Home');
        } else {
            setLocalError(getLoginError(error));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Welcome Back</Text>

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
                name="password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                theme={{ colors: { primary: colors.primary } }}
                right={<TextInput.Icon name="eye" />}
            />

            {(error || localError) && (
                <View style={[styles.errorContainer, { backgroundColor: colors.errorContainer }]}>
                    <Text style={[styles.errorText, { color: colors.error }]}>
                        {localError || getLoginError(error)}
                    </Text>
                </View>
            )}

            <Button
                mode="contained"
                onPress={handleLogin}
                style={[styles.button, { backgroundColor: colors.primary }]}
                loading={isLoading}
                disabled={isLoading}
                labelStyle={{ color: colors.onPrimary }}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={[styles.link, { color: colors.primary }]}>
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={[styles.link, { color: colors.primary }]}>
                        Forgot password?
                    </Text>
                </TouchableOpacity>
            </View>
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
        borderRadius: 8,
        paddingVertical: 8,
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
    linksContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    link: {
        marginVertical: 8,
        fontSize: 14,
    },
});

export default LoginScreen;
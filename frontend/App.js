import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AppNavigator } from './navigation/AppNavigator';
import theme from './theme';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
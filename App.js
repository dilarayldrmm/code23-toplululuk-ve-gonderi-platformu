import React from 'react';

import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <PostProvider>
            <AppNavigator />
          </PostProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
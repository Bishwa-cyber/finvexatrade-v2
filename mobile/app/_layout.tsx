import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AlertProvider } from '../components/AlertProvider';
import React from 'react';

const AppWithProviders = () => {
  const { theme } = useTheme();
  
  return (
    <AlertProvider theme={theme}>
      <Slot />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </AlertProvider>
  );
};

export default function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache}>
        <ThemeProvider>
          <AppWithProviders />
        </ThemeProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

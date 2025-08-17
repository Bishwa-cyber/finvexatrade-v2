import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const SecurityPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // You would add logic here to handle password change and 2FA setup
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Security' }} />
      <Text style={[styles.placeholder, { color: isDark ? '#FFF' : '#000' }]}>Security Options (e.g., Change Password, 2FA) will be here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: 16, textAlign: 'center', padding: 20 },
});

export default SecurityPage;

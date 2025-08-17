import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const BuyCryptoPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Buy Crypto' }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Buy Crypto</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          This is where you would integrate with an on-ramp provider like MoonPay or Ramp.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center' },
});

// This is the required default export line that fixes the warning.
export default BuyCryptoPage;

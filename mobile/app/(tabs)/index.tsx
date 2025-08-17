import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import TradingDashboard from '../../components/dashboard/TradingDashboard';
import { TradingIcons } from '../../components/dashboard/DashboardIcons';

// A simple screen for signed-out users
const SignInScreen = () => (
  <View style={styles.signInContainer}>
    <View style={styles.signInHeader}>
      <Text style={styles.signInTitle}>Welcome to</Text>
      <Text style={styles.signInSubtitle}>Finvexa Trade</Text>
      <Text style={styles.signInDescription}>Your gateway to advanced trading and investment opportunities.</Text>
    </View>
    <View style={styles.iconRow}>
      <View style={styles.iconContainer}><TradingIcons.Bitcoin size={32} color="#F7931A" /></View>
      <View style={styles.iconContainer}><TradingIcons.Analytics size={32} color="#10B981" /></View>
      <View style={styles.iconContainer}><TradingIcons.Trade size={32} color="#06B6D4" /></View>
    </View>
    <Link href="/(auth)/sign-in" asChild>
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In & Get Started</Text>
      </TouchableOpacity>
    </Link>
  </View>
);

// The main entry point for this tab
const HomePage: React.FC = () => (
  <View style={styles.container}>
    <SignedIn>
      <TradingDashboard />
    </SignedIn>
    <SignedOut>
      <SignInScreen />
    </SignedOut>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  signInContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#0b101a' },
  signInHeader: { alignItems: 'center', marginBottom: 60 },
  signInTitle: { fontSize: 32, color: '#9CA3AF', fontWeight: '300' },
  signInSubtitle: { fontSize: 42, color: '#FFFFFF', fontWeight: '800', marginBottom: 16 },
  signInDescription: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  iconRow: { flexDirection: 'row', gap: 24, marginBottom: 80 },
  iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1F2937' },
  signInButton: { backgroundColor: '#F7F8FB', borderRadius: 16, paddingVertical: 18, width: '100%' },
  signInButtonText: { fontSize: 18, color: '#000000', fontWeight: '700', textAlign: 'center' },
});

export default HomePage;

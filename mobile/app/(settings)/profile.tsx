import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileRow = ({ label, value, isDark }) => (
  <View style={styles.row}>
    <Text style={[styles.label, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{label}</Text>
    <Text style={[styles.value, { color: isDark ? '#FFFFFF' : '#111827' }]}>{value}</Text>
  </View>
);

const ProfilePage = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Profile' }} />
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        <Text style={[styles.name, { color: isDark ? '#FFFFFF' : '#111827' }]}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <ProfileRow label="First Name" value={user?.firstName} isDark={isDark} />
        <ProfileRow label="Last Name" value={user?.lastName} isDark={isDark} />
        <ProfileRow label="Joined On" value={user?.createdAt?.toLocaleDateString()} isDark={isDark} />
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileHeader: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#6B7280' },
  detailsContainer: { marginTop: 30, backgroundColor: '#111827', borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: '600' },
  editButton: { marginTop: 40, backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center' },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default ProfilePage;

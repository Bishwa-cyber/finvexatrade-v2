import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlertContext } from '../../components/AlertProvider';
import { useRouter } from 'expo-router';
import SignOutButton from '../../components/SignOutButton';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Reusable Components for this screen ---

const ChevronRight = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsRow = ({ title, icon, onPress }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemContent}>
        <View style={styles.settingIcon}>{icon}</View>
        <Text style={styles.settingLabel}>{title}</Text>
      </View>
      <ChevronRight color={isDark ? '#4B5563' : '#9CA3AF'} />
    </TouchableOpacity>
  );
};

// --- Main Settings Page Component ---

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { showSuccess } = useAlertContext();
  const router = useRouter();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const handleThemeToggle = () => {
    toggleTheme();
    showSuccess('Theme Changed', `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode!`);
  };

  const menuItems = [
    { title: 'Profile', icon: <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#8B5CF6" strokeWidth="2"/><Circle cx="12" cy="7" r="4" stroke="#8B5CF6" strokeWidth="2"/></Svg>, route: '/(settings)/profile' },
    { title: 'Security', icon: <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#10B981" strokeWidth="2"/></Svg>, route: '/(settings)/security' },
    { title: 'Notifications', icon: <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M18 8c0-3.3-2.7-6-6-6S6 4.7 6 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke="#F59E0B" strokeWidth="2"/><Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="#F59E0B" strokeWidth="2"/></Svg>, route: '/(settings)/notifications' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map(item => <SettingsRow key={item.title} {...item} onPress={() => router.push(item.route)} />)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <View style={styles.settingIcon}><Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#3B82F6" strokeWidth="2"/></Svg></View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch value={isDark} onValueChange={handleThemeToggle} trackColor={{ false: '#767577', true: '#10B981' }} thumbColor={'#f4f3f4'} />
          </View>
        </View>

        <View style={styles.section}>
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#000000' : '#F9FAFB' },
  content: { padding: 20 },
  header: { marginBottom: 32, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: isDark ? '#FFFFFF' : '#111827' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: 12, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, backgroundColor: isDark ? '#111827' : '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, marginBottom: 8 },
  settingItemContent: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#1F2937' : '#F3F4F6', marginRight: 16 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#374151' },
});

export default SettingsPage;

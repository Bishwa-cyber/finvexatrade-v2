import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const NotificationRow = ({ label, value, onValueChange, isDark }) => (
    <View style={[styles.row, { backgroundColor: isDark ? '#111827' : '#FFFFFF'}]}>
        <Text style={[styles.label, {color: isDark ? '#FFF' : '#000'}]}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#767577', true: '#10B981' }} thumbColor={'#f4f3f4'} />
    </View>
);

const NotificationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // Add state for each toggle
  const [priceAlerts, setPriceAlerts] = React.useState(true);
  const [newsUpdates, setNewsUpdates] = React.useState(true);
  const [tradeConfirmations, setTradeConfirmations] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <NotificationRow label="Price Alerts" value={priceAlerts} onValueChange={setPriceAlerts} isDark={isDark} />
      <NotificationRow label="News Updates" value={newsUpdates} onValueChange={setNewsUpdates} isDark={isDark} />
      <NotificationRow label="Trade Confirmations" value={tradeConfirmations} onValueChange={setTradeConfirmations} isDark={isDark} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 8, marginHorizontal: 16, borderRadius: 12 },
  label: { fontSize: 16, fontWeight: '600' },
});

export default NotificationsPage;

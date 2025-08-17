import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlertContext } from '../../components/AlertProvider';
import { AlertService, PriceAlert } from '../../services/alert.service';
import AlertItem from '../../components/alerts/AlertItem';
import CreateAlertModal from '../../components/alerts/CreateAlertModal'; // Assuming modal is a separate component
import { useIsFocused } from '@react-navigation/native';

const AlertsPage: React.FC = () => {
  const { theme } = useTheme();
  const { showSuccess, showError } = useAlertContext();
  const isDark = theme === 'dark';
  const isFocused = useIsFocused();

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    const savedAlerts = await AlertService.getAlerts();
    setAlerts(savedAlerts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadAlerts();
    }
  }, [isFocused, loadAlerts]);

  const handleDelete = async (alertId: string) => {
    try {
      const remainingAlerts = await AlertService.deleteAlert(alertId);
      setAlerts(remainingAlerts);
      showSuccess('Alert Deleted', 'The price alert has been removed.');
    } catch (error) {
      showError('Delete Failed', 'Could not delete the alert.');
    }
  };

  const handleAlertCreated = () => {
    setIsModalVisible(false);
    loadAlerts(); // Reload alerts to show the new one
    showSuccess('Alert Created!', 'We will notify you when the price target is met.');
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator style={{ marginTop: 50 }} size="large" color={isDark ? '#FFF' : '#000'} />;
    }
    if (alerts.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No Active Alerts</Text>
          <Text style={styles.emptyStateSubText}>Tap "Create New Alert" to get started.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={alerts}
        renderItem={({ item }) => <AlertItem alert={item} onDelete={handleDelete} isDark={isDark} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F9FAFB' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>Price Alerts</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
      <CreateAlertModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAlertCreated={handleAlertCreated}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  createButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  createButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  listContainer: { paddingTop: 8 },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { fontSize: 20, fontWeight: '600', color: '#9CA3AF' },
  emptyStateSubText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
});

export default AlertsPage;

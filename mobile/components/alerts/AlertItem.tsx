import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { PriceAlert } from '../../services/alert.service';
import { formatCurrency } from '../../utils/formatters';
import Svg, { Path } from 'react-native-svg';

const TrashIcon = () => <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#FFF" strokeWidth="2"/></Svg>;

interface AlertItemProps {
  alert: PriceAlert;
  onDelete: (alertId: string) => void;
  isDark: boolean;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onDelete, isDark }) => {
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => onDelete(alert.id)} style={styles.deleteButton}>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <TrashIcon />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[styles.itemContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Image source={{ uri: alert.coinImage }} style={styles.coinImage} />
        <View style={styles.infoContainer}>
          <Text style={[styles.coinName, { color: isDark ? '#FFF' : '#000' }]}>{alert.coinName} ({alert.coinSymbol.toUpperCase()})</Text>
          <Text style={styles.conditionText}>
            When price is <Text style={styles.conditionHighlight}>{alert.condition}</Text>
          </Text>
        </View>
        <Text style={[styles.targetPrice, { color: isDark ? '#FFF' : '#000' }]}>{formatCurrency(alert.targetPrice)}</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteButton: { backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'flex-end', width: 80, paddingRight: 20 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#374151' },
  coinImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  infoContainer: { flex: 1 },
  coinName: { fontSize: 16, fontWeight: '600' },
  conditionText: { color: '#9CA3AF', marginTop: 4 },
  conditionHighlight: { fontWeight: 'bold' },
  targetPrice: { fontSize: 16, fontWeight: 'bold' },
});

export default AlertItem;

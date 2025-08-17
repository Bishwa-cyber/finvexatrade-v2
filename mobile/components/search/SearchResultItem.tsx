import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { CoinMarketData } from '../../services/crypto.service';
import { formatCurrency } from '../../utils/formatters';

// --- Reusable Trend Indicator Component ---
const UpArrow = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" fill={color} /></Svg> );
const DownArrow = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 20l-8-8h6V4h4v8h6l-8 8z" fill={color} /></Svg> );
const NeutralDash = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" /></Svg> );

const TrendIndicator: React.FC<{ change: number | null }> = React.memo(({ change }) => {
  if (change === null || change === undefined) {
    const color = '#9CA3AF';
    return (
      <View style={styles.trendIndicator}>
        <NeutralDash size={14} color={color} />
        <Text style={[styles.trendText, { color }]}>N/A</Text>
      </View>
    );
  }

  const isUp = change >= 0;
  const color = isUp ? '#10B981' : '#EF4444';
  const valueText = `${change.toFixed(2)}%`;

  return (
    <View style={styles.trendIndicator}>
      <View style={{ marginRight: 4 }}>
        {isUp ? <UpArrow size={14} color={color} /> : <DownArrow size={14} color={color} />}
      </View>
      <Text style={[styles.trendText, { color }]}>{valueText}</Text>
    </View>
  );
});


// --- Main Search Result Item Component ---
interface SearchResultItemProps {
    item: CoinMarketData;
    isDark: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, isDark }) => {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to the dynamic details page we created
    router.push(`/crypto/${item.id}`);
  };

  return (
    <TouchableOpacity style={[styles.resultItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]} onPress={handlePress}>
      <Image source={{ uri: item.image }} style={styles.coinImage} />
      <View style={styles.coinInfo}>
        <Text style={[styles.coinName, { color: isDark ? '#FFFFFF' : '#111827' }]}>{item.name}</Text>
        <Text style={[styles.coinSymbol, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{item.symbol.toUpperCase()}</Text>
      </View>
      <View style={styles.coinPriceContainer}>
        <Text style={[styles.coinPrice, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {item.current_price ? formatCurrency(item.current_price) : 'N/A'}
        </Text>
        <TrendIndicator change={item.price_change_percentage_24h} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  coinImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  coinInfo: { flex: 1 },
  coinName: { fontSize: 16, fontWeight: '600' },
  coinSymbol: { fontSize: 14, textTransform: 'uppercase' },
  coinPriceContainer: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  trendIndicator: { flexDirection: 'row', alignItems: 'center' },
  trendText: { fontSize: 14, fontWeight: '600' },
});

export default SearchResultItem;


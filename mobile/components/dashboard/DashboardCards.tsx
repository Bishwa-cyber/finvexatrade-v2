import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BalanceData } from '../../services/market.service';
import { CoinMarketData } from '../../services/crypto.service';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import SignOutButton from '../SignOutButton';

const UpArrow = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" fill={color} /></Svg> );
const DownArrow = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 20l-8-8h6V4h4v8h6l-8 8z" fill={color} /></Svg> );
const NeutralDash = ({ size, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" /></Svg> );

export const TrendIndicator: React.FC<{ change: number | null }> = React.memo(({ change }) => {
    if (change === null || change === undefined) {
      const color = '#9CA3AF';
      return ( <View style={styles.trendIndicator}><NeutralDash size={14} color={color} /><Text style={[styles.trendText, { color }]}>N/A</Text></View> );
    }
    const isUp = change >= 0;
    const color = isUp ? '#10B981' : '#EF4444';
    return ( <View style={styles.trendIndicator}><View style={{ marginRight: 4 }}>{isUp ? <UpArrow size={14} color={color} /> : <DownArrow size={14} color={color} />}</View><Text style={[styles.trendText, { color }]}>{`${change.toFixed(2)}%`}</Text></View> );
});

export const BalanceCard: React.FC<{ data: BalanceData; isDark: boolean }> = React.memo(({ data, isDark }) => (
    <View style={[styles.balanceCard, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
      <View style={styles.balanceHeader}><Text style={[styles.balanceLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Total Balance</Text><SignOutButton /></View>
      <Text style={[styles.balanceAmount, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{formatCurrency(data.total)}</Text>
      <View style={styles.balanceChange}>
        <Text style={[styles.trendText, { color: data.isUp ? '#10B981' : '#EF4444' }]}>{`${data.isUp ? '+' : ''}${formatCurrency(data.changeValue)} (${data.changePercent.toFixed(2)}%)`}</Text>
        <Text style={[styles.balanceChangeTime, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>Today</Text>
      </View>
    </View>
));
  
export const MarketCard: React.FC<{ item: CoinMarketData; isDark: boolean }> = React.memo(({ item, isDark }) => {
    const flashAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => { Animated.sequence([ Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }), Animated.timing(flashAnim, { toValue: 0, duration: 800, useNativeDriver: false }) ]).start(); }, [item.current_price]);
    const flashColor = flashAnim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', item.price_change_percentage_24h >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'] });
    return (
      <Animated.View style={[styles.marketDataCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: flashColor }]}>
        <View style={styles.marketDataHeader}><Image source={{ uri: item.image }} style={styles.marketCoinImage} /><Text style={[styles.marketSymbol, { color: isDark ? '#E5E7EB' : '#111827' }]} numberOfLines={1}>{item.symbol.toUpperCase()}</Text></View>
        <Text style={[styles.marketPrice, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{item.current_price ? formatCurrency(item.current_price) : 'N/A'}</Text>
        <TrendIndicator change={item.price_change_percentage_24h} />
      </Animated.View>
    );
});

const styles = StyleSheet.create({
    balanceCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1F2937' },
    balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    balanceLabel: { fontSize: 14, fontWeight: '500' },
    balanceAmount: { fontSize: 36, fontWeight: '800', marginBottom: 8 },
    balanceChange: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    balanceChangeTime: { fontSize: 12, fontWeight: '500' },
    trendIndicator: { flexDirection: 'row', alignItems: 'center' },
    trendText: { fontSize: 14, fontWeight: '600' },
    marketDataCard: { borderRadius: 12, padding: 16, marginRight: 12, width: 140, borderWidth: 1 },
    marketDataHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    marketCoinImage: { width: 24, height: 24, borderRadius: 12 },
    marketSymbol: { fontSize: 14, fontWeight: '600', flexShrink: 1 },
    marketPrice: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});

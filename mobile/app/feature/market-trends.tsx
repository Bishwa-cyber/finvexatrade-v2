import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { CryptoService, TrendingCoin } from '../../services/crypto.service';
import { formatCurrency } from '../../utils/formatters';
import Svg, { Polyline } from 'react-native-svg';

// A simple component to render the 7-day sparkline
const Sparkline = ({ data, isDark }) => {
  // Gracefully handle cases where sparkline data is missing
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <View style={{ width: 100, height: 40 }} />; // Return an empty view to maintain layout
  }
  
  const height = 40;
  const width = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);

  // Guard against division by zero if all data points are the same
  if (max === min) {
    return (
        <Svg height={height} width={width}>
            <Polyline points={`0,${height/2} ${width},${height/2}`} fill="none" stroke={isDark ? '#4B5563' : '#D1D5DB'} strokeWidth="2" />
        </Svg>
    );
  }

  const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

  return (
    <Svg height={height} width={width}>
      <Polyline
        points={points}
        fill="none"
        stroke={isDark ? '#10B981' : '#16A34A'}
        strokeWidth="2"
      />
    </Svg>
  );
};

const TrendItem = ({ item, index, isDark, router }) => {
  // THE FIX: Use optional chaining (?.) to safely access nested properties.
  // This prevents crashes if `item.data` or `item.data.price` is undefined.
  const price = item?.item?.data?.price;
  const sparklineData = item?.item?.data?.sparkline_7d?.price;
  const marketCapRank = item?.item?.market_cap_rank;

  return (
    <TouchableOpacity onPress={() => router.push(`/crypto/${item.item.id}`)} style={[styles.itemContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
      <View style={styles.left}>
        <Text style={[styles.rank, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{index + 1}</Text>
        <Image source={{ uri: item.item.small }} style={styles.coinImage} />
        <View>
          <Text style={[styles.coinName, { color: isDark ? '#FFFFFF' : '#111827' }]} numberOfLines={1}>{item.item.name}</Text>
          <Text style={[styles.coinSymbol, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{item.item.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.middle}>
          <Sparkline data={sparklineData} isDark={isDark} />
      </View>
      <View style={styles.right}>
        {/* Display 'N/A' if the price is not available */}
        <Text style={[styles.price, { color: isDark ? '#FFFFFF' : '#111827' }]}>{price ? formatCurrency(price) : 'N/A'}</Text>
        {/* Display rank only if it exists */}
        {marketCapRank && (
          <Text style={[styles.rank, { color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 4 }]}>
            Rank: #{marketCapRank}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const MarketTrendsPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await CryptoService.getTrendingCoins();
        setTrending(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={isDark ? '#FFF' : '#000'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Market Trends' }} />
      <FlatList
        data={trending}
        keyExtractor={(item) => item.item.id}
        renderItem={({ item, index }) => <TrendItem item={item} index={index} isDark={isDark} router={router} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 16 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginBottom: 12, borderRadius: 12 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1.2 },
  middle: { flex: 1, alignItems: 'center' },
  right: { flex: 1, alignItems: 'flex-end' },
  rank: { fontSize: 14, fontWeight: 'bold' },
  coinImage: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 12 },
  coinName: { fontSize: 16, fontWeight: 'bold' },
  coinSymbol: { fontSize: 14, textTransform: 'uppercase' },
  price: { fontSize: 16, fontWeight: 'bold' },
});

export default MarketTrendsPage;

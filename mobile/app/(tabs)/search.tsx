import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  Keyboard, TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlertContext } from '../../components/AlertProvider';
import { useDebounce } from '../../hooks/useDebounce';
import { CryptoService, CoinMarketData } from '../../services/crypto.service';
import { SearchInput } from '../../components/search/SearchInput';
import { SearchSkeleton } from '../../components/search/SearchSkeleton';
import SearchResultItem from '../../components/search/SearchResultItem'; 

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { showError } = useAlertContext();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately for trending coins
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (debouncedQuery.trim().length > 0) {
        // Fetch search results
        const searchResults = await CryptoService.searchCoins(debouncedQuery);
        const coinIds = searchResults.map(coin => coin.id);
        data = await CryptoService.getMarkets(coinIds);
      } else {
        // Fetch top/trending coins for initial state
        data = await CryptoService.getTopCoins(10);
      }
      setResults(data);
    } catch (e) {
      setError('Could not fetch data. Please try again.');
      showError('Network Error', 'Failed to fetch cryptocurrency data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedQuery]);

  const renderContent = () => {
    if (isLoading) {
      return <SearchSkeleton isDark={isDark} />;
    }
    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (results.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Results Found</Text>
          <Text style={styles.emptySubText}>Try a different search term.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={results}
        renderItem={({ item }) => <SearchResultItem item={item} isDark={isDark} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F9FAFB' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {debouncedQuery ? 'Search Results' : 'Trending Coins'}
        </Text>
      </View>
      <View style={styles.searchSection}>
        <SearchInput query={query} setQuery={setQuery} isDark={isDark} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  searchSection: { padding: 20 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#9CA3AF' },
  emptySubText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
  errorText: { fontSize: 18, fontWeight: '600', color: '#EF4444', marginBottom: 20 },
  retryButton: { backgroundColor: '#1F2937', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  retryButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default SearchPage;

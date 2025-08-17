import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { NewsService, Article } from '../../services/news.service';
import * as WebBrowser from 'expo-web-browser';
import { useAlertContext } from '../../components/AlertProvider';

const NewsItemSkeleton = ({ isDark }) => {
    const opacity = React.useRef(new Animated.Value(0.5)).current;
    useEffect(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])).start();
    }, []);
  
    return (
      <Animated.View style={[styles.itemContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', opacity }]}>
        <View style={styles.skeletonImage} />
        <View style={styles.textContainer}>
          <View style={[styles.skeletonLine, { width: '30%', height: 12 }]} />
          <View style={[styles.skeletonLine, { width: '90%' }]} />
          <View style={[styles.skeletonLine, { width: '70%' }]} />
        </View>
      </Animated.View>
    );
};
  
const NewsItem = ({ item, isDark }) => {
    const handlePress = () => {
      // Only open the browser if a valid URL exists
      if (item.url) {
        WebBrowser.openBrowserAsync(item.url);
      }
    };
  
    // Use a placeholder if the article image is missing
    const imageSource = item.imageUrl
      ? { uri: item.imageUrl } 
      : require('../../assets/images/placeholder-news.png');
  
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        style={[styles.itemContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
        disabled={!item.url} // Disable the button if there is no URL
      >
        <Image source={imageSource} style={styles.articleImage} />
        <View style={styles.textContainer}>
          <Text style={[styles.source, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.source?.toUpperCase() || 'NEWS'}
          </Text>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {item.title || 'No Title Available'}
          </Text>
          <Text style={[styles.date, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {new Date(item.publishedOn * 1000).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
};

const NewsTabs = ({ activeTab, setActiveTab, isDark }) => (
  <View style={styles.tabsContainer}>
    {['All', 'Crypto', 'Stocks'].map(tab => (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, activeTab === tab && { borderBottomColor: '#3B82F6' }]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, { color: isDark ? (activeTab === tab ? '#FFFFFF' : '#6B7280') : (activeTab === tab ? '#111827' : '#6B7280') }]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const NewsPage = () => {
  const { theme } = useTheme();
  const { showError } = useAlertContext();
  const isDark = theme === 'dark';

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await NewsService.getAllNews();
      setAllArticles(data);
    } catch (e) {
      setError('Could not fetch news. Please check your connection.');
      showError('Network Error', 'Failed to fetch the latest news.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Use useMemo for performance, so the list is only filtered when the tab or articles change.
  const filteredArticles = useMemo(() => {
    if (activeTab === 'All') {
      return allArticles;
    }
    return allArticles.filter(article => article.categories.includes(activeTab));
  }, [activeTab, allArticles]);

  const renderContent = () => {
    if (isLoading) {
      return <View style={styles.listContainer}>{[...Array(5)].map((_, i) => <NewsItemSkeleton key={i} isDark={isDark} />)}</View>;
    }
    if (error) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNews}><Text style={styles.retryButtonText}>Try Again</Text></TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsItem item={item} isDark={isDark} />}
        contentContainerStyle={styles.listContainer}
        onRefresh={fetchNews}
        refreshing={isLoading}
        ListEmptyComponent={() => (
          <View style={styles.messageContainer}><Text style={styles.emptyText}>No news found for this category.</Text></View>
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Market News' }} />
      <NewsTabs activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: '#374151',
      paddingHorizontal: 16,
    },
    tab: {
      paddingVertical: 12,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    listContainer: { padding: 16 },
    itemContainer: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#374151' },
    articleImage: { width: '100%', height: 180, backgroundColor: '#374151' },
    textContainer: { padding: 16 },
    source: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, lineHeight: 24 },
    date: { fontSize: 12 },
    messageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 18, color: '#9CA3AF' },
    errorText: { fontSize: 18, color: '#EF4444', textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
    retryButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    skeletonImage: { width: '100%', height: 180 },
    skeletonLine: { height: 16, borrderRadius: 4, backgroundColor: '#374151', marginBottom: 12 },
});
  
export default NewsPage;

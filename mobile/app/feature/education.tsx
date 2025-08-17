import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { CryptoService } from '../../services/crypto.service';

const { width } = Dimensions.get('window');

// Educational content structure
const LEARNING_MODULES = [
  {
    id: 1,
    title: "Crypto Basics",
    description: "Understanding blockchain, cryptocurrencies, and digital wallets",
    icon: "🔤",
    difficulty: "Beginner",
    duration: "15 min",
    lessons: [
      "What is Cryptocurrency?",
      "Understanding Blockchain",
      "Types of Cryptocurrencies",
      "Digital Wallets Explained"
    ]
  },
  {
    id: 2,
    title: "Investment Fundamentals",
    description: "Learn the core principles of crypto investing",
    icon: "📈",
    difficulty: "Beginner",
    duration: "20 min",
    lessons: [
      "Risk Management",
      "Dollar Cost Averaging",
      "Market Analysis Basics",
      "Portfolio Diversification"
    ]
  },
  {
    id: 3,
    title: "Technical Analysis",
    description: "Reading charts and identifying trading patterns",
    icon: "📊",
    difficulty: "Intermediate",
    duration: "30 min",
    lessons: [
      "Candlestick Patterns",
      "Support & Resistance",
      "Moving Averages",
      "RSI & MACD Indicators"
    ]
  },
  {
    id: 4,
    title: "Advanced Strategies",
    description: "DeFi, staking, and advanced trading techniques",
    icon: "🚀",
    difficulty: "Advanced",
    duration: "45 min",
    lessons: [
      "DeFi Protocols",
      "Yield Farming",
      "Options & Futures",
      "Tax Implications"
    ]
  }
];

const CRYPTO_TIPS = [
  {
    title: "Never Invest More Than You Can Afford to Lose",
    description: "Cryptocurrency markets are highly volatile. Only invest money you can afford to lose completely.",
    category: "Risk Management"
  },
  {
    title: "Do Your Own Research (DYOR)",
    description: "Always research projects thoroughly before investing. Don't rely solely on social media or influencer advice.",
    category: "Research"
  },
  {
    title: "Use Dollar Cost Averaging",
    description: "Instead of investing a lump sum, invest smaller amounts regularly to reduce the impact of volatility.",
    category: "Strategy"
  },
  {
    title: "Secure Your Assets",
    description: "Use hardware wallets for long-term storage and enable 2FA on all exchange accounts.",
    category: "Security"
  }
];

const ModuleCard = ({ module, onPress, isDark }) => (
  <TouchableOpacity 
    style={[styles.moduleCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
    onPress={() => onPress(module)}
  >
    <View style={styles.moduleHeader}>
      <Text style={styles.moduleIcon}>{module.icon}</Text>
      <View style={styles.moduleInfo}>
        <Text style={[styles.moduleTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {module.title}
        </Text>
        <Text style={[styles.moduleDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {module.description}
        </Text>
      </View>
    </View>
    <View style={styles.moduleFooter}>
      <View style={[styles.difficultyBadge, { 
        backgroundColor: module.difficulty === 'Beginner' ? '#10B981' : 
                        module.difficulty === 'Intermediate' ? '#F59E0B' : '#EF4444' 
      }]}>
        <Text style={styles.difficultyText}>{module.difficulty}</Text>
      </View>
      <Text style={[styles.duration, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        {module.duration}
      </Text>
    </View>
  </TouchableOpacity>
);

const TipCard = ({ tip, isDark }) => (
  <View style={[styles.tipCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
    <View style={styles.tipHeader}>
      <Text style={[styles.tipCategory, { color: '#10B981' }]}>{tip.category}</Text>
    </View>
    <Text style={[styles.tipTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
      {tip.title}
    </Text>
    <Text style={[styles.tipDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
      {tip.description}
    </Text>
  </View>
);

const MarketInsightCard = ({ coin, isDark }) => (
  <View style={[styles.insightCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
    <View style={styles.insightHeader}>
      <Image source={{ uri: coin.image }} style={styles.coinIcon} />
      <View>
        <Text style={[styles.coinName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {coin.name}
        </Text>
        <Text style={[styles.coinSymbol, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {coin.symbol.toUpperCase()}
        </Text>
      </View>
    </View>
    <View style={styles.priceInfo}>
      <Text style={[styles.price, { color: isDark ? '#FFFFFF' : '#111827' }]}>
        ${coin.current_price.toLocaleString()}
      </Text>
      <Text style={[
        styles.priceChange,
        { color: coin.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444' }
      ]}>
        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
        {coin.price_change_percentage_24h.toFixed(2)}%
      </Text>
    </View>
  </View>
);

const EducationPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';

  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const coins = await CryptoService.getTopCoins(5);
        setTopCoins(coins);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleModulePress = (module) => {
    setSelectedModule(module);
    // Navigate to detailed lesson page
    router.push(`/feature/lesson/${module.id}`);
  };

  if (selectedModule) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
        <Stack.Screen options={{ title: selectedModule.title }} />
        <ScrollView contentContainerStyle={styles.lessonContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedModule(null)}
          >
            <Text style={[styles.backButtonText, { color: isDark ? '#FFFFFF' : '#000' }]}>
              ← Back to Modules
            </Text>
          </TouchableOpacity>

          <Text style={[styles.lessonTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {selectedModule.title}
          </Text>
          
          <Text style={[styles.lessonDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {selectedModule.description}
          </Text>

          <View style={styles.lessonsContainer}>
            {selectedModule.lessons.map((lesson, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.lessonItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              >
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.lessonText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {lesson}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Learn Crypto Investment' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Master Crypto Investment
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Learn from basics to advanced strategies with real market insights
          </Text>
        </View>

        {/* Market Insights Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Live Market Insights
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#10B981" style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.insightsContainer}
            >
              {topCoins.map((coin) => (
                <MarketInsightCard key={coin.id} coin={coin} isDark={isDark} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Learning Modules Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Learning Modules
          </Text>
          {LEARNING_MODULES.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onPress={handleModulePress}
              isDark={isDark}
            />
          ))}
        </View>

        {/* Pro Tips Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Investment Tips
          </Text>
          {CRYPTO_TIPS.map((tip, index) => (
            <TipCard key={index} tip={tip} isDark={isDark} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={() => router.push('/feature/calculator')}
            >
              <Text style={styles.actionButtonText}>📊 Investment Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
              onPress={() => router.push('/feature/market-trends')}
            >
              <Text style={styles.actionButtonText}>📈 Market Analysis</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
              onPress={() => router.push('/feature/portfolio')}
            >
              <Text style={styles.actionButtonText}>💼 Portfolio Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => router.push('/feature/news')}
            >
              <Text style={styles.actionButtonText}>📰 Latest News</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  insightsContainer: {
    paddingHorizontal: 20,
  },
  insightCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  coinName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  coinSymbol: {
    fontSize: 12,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tipHeader: {
    marginBottom: 8,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Lesson Detail Styles
  lessonContainer: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lessonDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  lessonsContainer: {
    marginTop: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default EducationPage;

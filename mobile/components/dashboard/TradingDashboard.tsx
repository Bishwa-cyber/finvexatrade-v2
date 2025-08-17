import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
  Dimensions, StatusBar, Platform, Image, FlatList, ActivityIndicator,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
// Local Imports
import Sidebar from '../../components/sidebar';
import { useAlertContext } from '../AlertProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketService, BalanceData } from '../../services/market.service';
import { CryptoService, CoinMarketData } from '../../services/crypto.service';
import { BalanceCard, MarketCard } from './DashboardCards';
import { TradingIcons } from './DashboardIcons';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, gradient, onPress }) => ( <TouchableOpacity onPress={onPress} style={styles.featureCard} activeOpacity={0.8}><View style={[styles.featureIconContainer, { backgroundColor: `${gradient}20` }]}>{icon}</View><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureDescription}>{description}</Text></TouchableOpacity> );
const QuickActionButton = ({ icon, title, onPress, color }) => ( <TouchableOpacity style={styles.quickActionButton} onPress={onPress} activeOpacity={0.8}><View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>{icon}</View><Text style={styles.quickActionTitle}>{title}</Text></TouchableOpacity> );

const TradingDashboard: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const { showSuccess, showWarning, showError } = useAlertContext();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [balance, setBalance] = useState<BalanceData | null>(null);
    const [marketData, setMarketData] = useState<CoinMarketData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const balanceInterval = setInterval(() => setBalance(MarketService.fetchData().balance), 3000);
        const fetchMarketData = async () => {
            try {
                const topCoins = await CryptoService.getTopCoins(20);
                setMarketData(topCoins);
            } catch (error) {
                showError('Market Data Error', 'Could not fetch live market data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMarketData();
        const marketInterval = setInterval(fetchMarketData, 60000);
        return () => { clearInterval(balanceInterval); clearInterval(marketInterval); };
    }, []);

    const handleTradingAction = () => showWarning('Trading Risk', 'Trading involves risk. Proceed with caution.', () => showSuccess('Trade Confirmed', 'Your order has been placed.'));
    
    // --- UPDATED ROUTES ---
    const features = [
      { icon: <TradingIcons.Trade size={28} color="#06B6D4" />, title: "Live Trading", description: "Execute trades with advanced charting tools", gradient: "#06B6D4", onPress: () => router.push('/feature/trading') },
      { icon: <TradingIcons.Analytics size={28} color="#10B981" />, title: "Analytics", description: "Deep market analysis and insights", gradient: "#10B981", onPress: () => router.push('/feature/analytics') },
      { icon: <TradingIcons.Portfolio size={28} color="#8B5CF6" />, title: "Portfolio", description: "Manage investments and track performance", gradient: "#8B5CF6", onPress: () => router.push('/feature/portfolio') },
      { icon: <TradingIcons.Wallet size={28} color="#EF4444" />, title: "Wallet", description: "Secure digital wallet for your assets", gradient: "#EF4444", onPress: () => router.push('/feature/wallet') },
    ];
    const quickActions = [
      { icon: <TradingIcons.Bitcoin size={24} color="#F7931A" />, title: "Buy Crypto", color: "#F7931A", onPress: () => router.push('/feature/buy-crypto') },
      { icon: <TradingIcons.Trending size={24} color="#F59E0B" />, title: "Trends", color: "#F59E0B", onPress: () => router.push('/feature/market-trends') },
      { icon: <TradingIcons.News size={24} color="#F97316" />, title: "News", color: "#F97316", onPress: () => router.push('/feature/news') },
      { icon: <TradingIcons.Settings size={24} color="#6B7280" />, title: "Settings", color: "#6B7280", onPress: () => router.push('/(tabs)/settings') }, // This route is correct, no change needed
      { icon: <TradingIcons.Education size={24} color="#8B5CF6" />, title: "Learn", color: "#8B5CF6", onPress: () => router.push('/feature/education') },
      { icon: <TradingIcons.Calculator size={24} color="#10B981" />, title: "Tools", color: "#10B981", onPress: () => router.push('/feature/calculator') },
      { icon: <TradingIcons.Support size={24} color="#EF4444" />, title: "Support", color: "#EF4444", onPress: () => router.push('/feature/support') },
      { icon: <TradingIcons.History size={24} color="#F59E0B" />, title: "History", color: "#F59E0B", onPress: () => router.push('/feature/history') },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000000' : '#F9FAFB' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* --- FIXED HEADER SECTION --- */}
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}><TradingIcons.Menu size={28} color={isDark ? '#FFFFFF' : '#1F2937'} /></TouchableOpacity>
                        <View><Text style={[styles.welcomeText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Welcome back,</Text><Text style={[styles.userNameText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{user?.firstName || 'Trader'}!</Text></View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationButton}><TradingIcons.Bell size={24} color={isDark ? '#FFFFFF' : '#1F2937'} /><View style={styles.notificationBadge}><Text style={styles.notificationCount}>3</Text></View></TouchableOpacity>
                        {/* --- UPDATED ROUTE --- */}
                        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/feature/profile')}><Image source={{ uri: user?.imageUrl || "https://drive.google.com/uc?export=view&id=17ZpBAmNPuc7hPF3loQwbafJ79JhCiJ9I" }} style={styles.profileImage} /></TouchableOpacity>
                    </View>
                </View>
                {balance ? <BalanceCard data={balance} isDark={isDark} /> : <View style={styles.balanceCardSkeleton} />}
            </View>
            
            {/* --- SCROLLABLE CONTENT SECTION --- */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Market Overview</Text>
                    {isLoading ? <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#000000'} style={{ height: 100 }} /> : <FlatList data={marketData} renderItem={({ item }) => <MarketCard item={item} isDark={isDark} />} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketDataList} />}
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>{quickActions.map((action, index) => <QuickActionButton key={index} {...action} />)}</View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Trading Features</Text>
                    <View style={styles.featuresGrid}>{features.map((feature, index) => <FeatureCard key={index} {...feature} />)}</View>
                </View>
                 {/* --- UPDATED ROUTE --- */}
                <View style={styles.section}><TouchableOpacity style={styles.tradingButton} onPress={() => router.push('/feature/trading')}><Text style={styles.tradingButtonText}>Start Trading Now</Text><TradingIcons.Trade size={20} color="#000000" /></TouchableOpacity></View>
            </ScrollView>
            
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} user={user} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    headerContainer: { 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'android' ? 40 : 20, 
        paddingBottom: 20 
    },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    menuButton: { padding: 8, marginRight: 12 },
    welcomeText: { fontSize: 16, fontWeight: '400' },
    userNameText: { fontSize: 24, fontWeight: '700' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notificationButton: { padding: 8, position: 'relative' },
    notificationBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
    notificationCount: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
    profileButton: {},
    profileImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#374151' },
    balanceCardSkeleton: { height: 138, borderRadius: 20, backgroundColor: '#111827' },
    scrollContainer: { paddingBottom: 40 },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, paddingHorizontal: 20 },
    marketDataList: { paddingHorizontal: 20 },
    quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20, paddingHorizontal: 20 },
    quickActionButton: { width: (width - 80) / 4, alignItems: 'center' },
    quickActionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickActionTitle: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#FFFFFF' },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16, paddingHorizontal: 20 },
    featureCard: { width: (width - 56) / 2, backgroundColor: '#111827', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1F2937' },
    featureIconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    featureTitle: { fontSize: 16, color: '#FFFFFF', fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    featureDescription: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', lineHeight: 16 },
    tradingButton: { backgroundColor: '#F7F8FB', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginHorizontal: 20 },
    tradingButtonText: { fontSize: 18, color: '#000000', fontWeight: '700', marginRight: 12 },
});

export default TradingDashboard;

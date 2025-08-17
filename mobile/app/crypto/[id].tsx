import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../../contexts/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const TIMEFRAMES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: "max" },
];

const CHART_TYPES = ["Line", "Candlestick"];

// Define types for better TypeScript support
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
  description: {
    en: string;
  };
}

interface CandleDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Move this outside the component to avoid re-creation
const getScreenDimensions = () => {
  try {
    const window = Dimensions.get('window');
    return {
      width: window?.width || 375,
      height: window?.height || 667
    };
  } catch (error) {
    console.warn("Error getting screen dimensions:", error);
    return { width: 375, height: 667 };
  }
};

// Chart wrapper component for error handling
const ChartWrapper = ({ children, fallback }) => {
  try {
    return children;
  } catch (error) {
    console.error("Chart render error:", error);
    return fallback;
  }
};

const CryptoDetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Use useMemo to memoize dimensions
  const screenDimensions = useMemo(() => getScreenDimensions(), []);
  const screenWidth = screenDimensions.width;

  const [coin, setCoin] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [candleData, setCandleData] = useState<CandleDataPoint[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(TIMEFRAMES[2]);
  const [chartType, setChartType] = useState(CHART_TYPES[0]);
  const [loading, setLoading] = useState(true);

  // Add this function to validate chart data
  const isValidChartData = () => {
    return (
      chartData && 
      Array.isArray(chartData) && 
      chartData.length > 0 && 
      chartData.every(value => typeof value === 'number' && !isNaN(value) && isFinite(value)) &&
      chartLabels &&
      Array.isArray(chartLabels) &&
      chartLabels.length > 0
    );
  };

  useEffect(() => {
    let isActive = true;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch coin general info
        const coinRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        const coinData = await coinRes.json();

        // Fetch chart prices (line chart)
        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${selectedTime.days}`
        );
        const chartJSON = await chartRes.json();

        // Fetch OHLC data (candlestick chart)
        const ohlcRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${selectedTime.days}`
        );
        const ohlcJSON = await ohlcRes.json();

        if (!isActive) return;

        setCoin(coinData);

        // Parse line chart data for react-native-chart-kit with improved validation
        if (Array.isArray(chartJSON.prices) && chartJSON.prices.length > 0) {
          try {
            const validPrices = chartJSON.prices
              .filter(([time, price]) => 
                typeof time === 'number' && 
                typeof price === 'number' && 
                !isNaN(price) && 
                isFinite(price)
              );
            
            if (validPrices.length > 0) {
              const prices = validPrices.map(([time, price]) => price);
              const maxLabels = 6;
              const labelInterval = Math.max(1, Math.floor(validPrices.length / maxLabels));
              
              const labels = validPrices
                .map(([time], index) => {
                  if (index % labelInterval === 0) {
                    return new Date(time).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }
                  return "";
                })
                .filter((label, index, arr) => label !== "" || index === arr.length - 1);
              
              setChartData(prices);
              setChartLabels(labels);
            } else {
              setChartData([]);
              setChartLabels([]);
            }
          } catch (parseError) {
            console.error("Error parsing chart data:", parseError);
            setChartData([]);
            setChartLabels([]);
          }
        } else {
          setChartData([]);
          setChartLabels([]);
        }

        // Parse candlestick data with improved validation
        if (Array.isArray(ohlcJSON) && ohlcJSON.length > 0) {
          try {
            const validCandles = ohlcJSON.filter(candle => 
              Array.isArray(candle) && 
              candle.length === 5 &&
              candle.every(val => typeof val === 'number' && !isNaN(val) && isFinite(val))
            );

            setCandleData(
              validCandles.map(([timestamp, open, high, low, close]) => ({
                timestamp,
                open,
                high,
                low,
                close,
              }))
            );
          } catch (candleError) {
            console.error("Error parsing candle data:", candleError);
            setCandleData([]);
          }
        } else {
          setCandleData([]);
        }
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
        // Reset data on error
        setChartData([]);
        setChartLabels([]);
        setCandleData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isActive = false;
    };
  }, [id, selectedTime]);

  const chartConfig = {
    backgroundGradientFrom: isDark ? "#1f2937" : "#ffffff",
    backgroundGradientTo: isDark ? "#1f2937" : "#ffffff",
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#10B981"
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? "#10B981" : "#16a34a"}
        />
      </SafeAreaView>
    );
  }

  if (!coin) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
      >
        <Text
          style={{
            color: isDark ? "#fff" : "#000",
            textAlign: "center",
            marginTop: 50,
            fontSize: 18,
          }}
        >
          Coin data not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? "#111827" : "#fff" }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButtonContainer}
      >
        <Text style={[styles.backButton, { color: isDark ? "#fff" : "#000" }]}>
          ‹ Back
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Coin Header */}
        <View style={styles.coinHeader}>
          <Image
            source={{ uri: coin?.image?.large }}
            style={styles.coinImage}
            resizeMode="contain"
          />
          <Text style={[styles.coinName, { color: isDark ? "#fff" : "#000" }]}>
            {coin?.name}
          </Text>
          <Text
            style={[styles.coinSymbol, { color: isDark ? "#9CA3AF" : "#6b7280" }]}
          >
            {coin?.symbol?.toUpperCase()}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
              Price
            </Text>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#000" }]}>
              {coin?.market_data?.current_price?.usd ? formatCurrency(coin.market_data.current_price.usd) : "N/A"}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
              Market Cap
            </Text>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#000" }]}>
              {coin?.market_data?.market_cap?.usd ? formatCurrency(coin.market_data.market_cap.usd) : "N/A"}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
              24h Volume
            </Text>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#000" }]}>
              {coin?.market_data?.total_volume?.usd ? formatCurrency(coin.market_data.total_volume.usd) : "N/A"}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
              24h Change
            </Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: (coin?.market_data?.price_change_percentage_24h || 0) >= 0
                    ? "#10B981"
                    : "#EF4444",
                },
              ]}
            >
              {coin?.market_data?.price_change_percentage_24h ? 
                `${coin.market_data.price_change_percentage_24h.toFixed(2)}%` : "N/A"}
            </Text>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeSelector}>
          {TIMEFRAMES.map((time) => (
            <TouchableOpacity
              key={time.label}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeframeBtn,
                selectedTime.label === time.label && styles.timeframeBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.timeframeBtnText,
                  selectedTime.label === time.label && styles.timeframeBtnTextSelected,
                ]}
              >
                {time.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Type Selector */}
        <View style={styles.chartTypeSelector}>
          {CHART_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setChartType(type)}
              style={[
                styles.chartTypeBtn,
                chartType === type && styles.chartTypeBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.chartTypeBtnText,
                  chartType === type && styles.chartTypeBtnTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Area */}
        <View style={styles.chartContainer}>
          {chartType === "Line" && isValidChartData() ? (
            <ChartWrapper 
              fallback={
                <View style={[styles.noDataContainer, { width: Math.max(screenWidth - 40, 300) }]}>
                  <Text style={[styles.noDataText, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
                    Chart rendering error
                  </Text>
                </View>
              }
            >
              <LineChart
                data={{
                  labels: chartLabels.slice(0, 6), // Limit labels to prevent overflow
                  datasets: [
                    {
                      data: chartData.length > 100 ? 
                        chartData.filter((_, index) => index % Math.ceil(chartData.length / 100) === 0) : 
                        chartData,
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={Math.max(screenWidth - 40, 300)} // Ensure minimum width
                height={220}
                yAxisLabel="$"
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withDots={false}
                withShadow={false}
                withScrollableDot={true}
              />
            </ChartWrapper>
          ) : chartType === "Candlestick" && candleData.length > 0 ? (
            <View style={[styles.candlestickPlaceholder, { width: Math.max(screenWidth - 40, 300) }]}>
              <Text style={[styles.placeholderText, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
                Candlestick Chart
              </Text>
              <Text style={[styles.placeholderSubtext, { color: isDark ? "#6b7280" : "#9CA3AF" }]}>
                {candleData.length} data points available
              </Text>
              {/* You can implement a custom candlestick chart here or use a different library */}
            </View>
          ) : (
            <View style={[styles.noDataContainer, { width: Math.max(screenWidth - 40, 300) }]}>
              <Text style={[styles.noDataText, { color: isDark ? "#9CA3AF" : "#6b7280" }]}>
                {loading ? "Loading chart data..." : "No chart data available"}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.alertBtn]}>
            <Text style={[styles.actionText, styles.alertText]}>Alert</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>
            About {coin?.name}
          </Text>
          <Text style={[styles.description, { color: isDark ? "#d1d5db" : "#4b5563" }]} numberOfLines={7}>
            {coin?.description?.en ? 
              coin.description.en.replace(/<\/?[^>]+(>|$)/g, "") : 
              "No description available."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  container: { 
    flex: 1 
  },
  backButtonContainer: { 
    marginTop: 14, 
    marginLeft: 16 
  },
  backButton: { 
    fontSize: 18,
    fontWeight: "600"
  },
  scrollContent: { 
    paddingBottom: 40, 
    paddingHorizontal: 16 
  },
  coinHeader: { 
    alignItems: "center", 
    marginVertical: 20 
  },
  coinImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40 
  },
  coinName: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginTop: 12,
    textAlign: "center"
  },
  coinSymbol: { 
    fontSize: 18, 
    marginTop: 4,
    textAlign: "center"
  },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 20,
    paddingHorizontal: 10
  },
  statBox: { 
    alignItems: "center", 
    flex: 1 
  },
  statLabel: { 
    fontSize: 12, 
    marginBottom: 4,
    textAlign: "center"
  },
  statValue: { 
    fontSize: 16, 
    fontWeight: "bold",
    textAlign: "center"
  },
  timeframeSelector: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 16,
    flexWrap: "wrap"
  },
  timeframeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  timeframeBtnSelected: { 
    backgroundColor: "#10B981" 
  },
  timeframeBtnText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#10B981" 
  },
  timeframeBtnTextSelected: {
    color: "#fff"
  },
  chartTypeSelector: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 20 
  },
  chartTypeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#06B6D4",
  },
  chartTypeBtnSelected: { 
    backgroundColor: "#06B6D4" 
  },
  chartTypeBtnText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#06B6D4" 
  },
  chartTypeBtnTextSelected: { 
    color: "#fff" 
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  candlestickPlaceholder: {
    height: 220,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionButtonsRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 24,
    flexWrap: "wrap"
  },
  actionBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 6,
    marginVertical: 4,
    minWidth: 80,
  },
  alertBtn: { 
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderColor: "#ef4444"
  },
  actionText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16,
    textAlign: "center"
  },
  alertText: { 
    color: "#ef4444" 
  },
  aboutSection: { 
    marginVertical: 20
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 12
  },
  description: { 
    fontSize: 15, 
    lineHeight: 22,
    textAlign: "justify"
  },
});

export default CryptoDetailPage;

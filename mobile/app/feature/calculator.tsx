import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { CryptoService } from '../../services/crypto.service';

const CalculatorPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [topCoins, setTopCoins] = useState([]);
  const [results, setResults] = useState(null);
  const [dcaAmount, setDcaAmount] = useState('');
  const [dcaPeriod, setDcaPeriod] = useState('weekly');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coins = await CryptoService.getTopCoins(10);
        setTopCoins(coins);
        setSelectedCoin(coins[0]);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };
    fetchCoins();
  }, []);

  const calculateInvestment = () => {
    if (!investmentAmount || !selectedCoin) {
      Alert.alert('Error', 'Please enter investment amount and select a coin');
      return;
    }

    const amount = parseFloat(investmentAmount);
    const currentPrice = selectedCoin.current_price;
    const coinsOwned = amount / currentPrice;

    // Calculate potential returns based on different scenarios
    const scenarios = [
      { name: 'Conservative (+20%)', multiplier: 1.2 },
      { name: 'Moderate (+50%)', multiplier: 1.5 },
      { name: 'Aggressive (+100%)', multiplier: 2.0 },
      { name: 'Moon (+500%)', multiplier: 6.0 },
    ];

    const calculatedResults = scenarios.map(scenario => ({
      ...scenario,
      futureValue: amount * scenario.multiplier,
      profit: (amount * scenario.multiplier) - amount,
      profitPercentage: (scenario.multiplier - 1) * 100,
    }));

    setResults({
      investmentAmount: amount,
      currentPrice,
      coinsOwned,
      scenarios: calculatedResults,
    });
  };

  const calculateDCA = () => {
    if (!dcaAmount || !selectedCoin) {
      Alert.alert('Error', 'Please enter DCA amount and select a coin');
      return;
    }

    const monthlyAmount = parseFloat(dcaAmount);
    const periodsPerYear = dcaPeriod === 'weekly' ? 52 : 12;
    const periodAmount = dcaPeriod === 'weekly' ? monthlyAmount / 4 : monthlyAmount;
    
    // Simulate DCA over 1 year
    const totalInvested = periodAmount * periodsPerYear;
    const avgCoinsPerPeriod = periodAmount / selectedCoin.current_price;
    const totalCoins = avgCoinsPerPeriod * periodsPerYear;

    Alert.alert(
      'DCA Calculation',
      `Investing $${periodAmount.toFixed(2)} ${dcaPeriod}\n\n` +
      `Total invested in 1 year: $${totalInvested.toFixed(2)}\n` +
      `Estimated coins owned: ${totalCoins.toFixed(6)} ${selectedCoin.symbol.toUpperCase()}\n` +
      `Current value: $${(totalCoins * selectedCoin.current_price).toFixed(2)}`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <Stack.Screen options={{ title: 'Investment Calculator' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Coin Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Select Cryptocurrency
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topCoins.map((coin) => (
              <TouchableOpacity
                key={coin.id}
                style={[
                  styles.coinSelector,
                  { 
                    backgroundColor: selectedCoin?.id === coin.id 
                      ? '#10B981' 
                      : (isDark ? '#1F2937' : '#FFFFFF'),
                    borderColor: '#374151'
                  }
                ]}
                onPress={() => setSelectedCoin(coin)}
              >
                <Text style={[
                  styles.coinSelectorText,
                  { 
                    color: selectedCoin?.id === coin.id 
                      ? '#FFFFFF' 
                      : (isDark ? '#FFFFFF' : '#111827')
                  }
                ]}>
                  {coin.symbol.toUpperCase()}
                </Text>
                <Text style={[
                  styles.coinPrice,
                  { 
                    color: selectedCoin?.id === coin.id 
                      ? '#FFFFFF' 
                      : (isDark ? '#9CA3AF' : '#6B7280')
                  }
                ]}>
                  ${coin.current_price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Investment Calculator */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Lump Sum Investment
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#111827',
                borderColor: '#374151'
              }
            ]}
            placeholder="Enter investment amount ($)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={investmentAmount}
            onChangeText={setInvestmentAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateInvestment}
          >
            <Text style={styles.calculateButtonText}>Calculate Returns</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Potential Returns
            </Text>
            <View style={[styles.resultCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              <Text style={[styles.resultText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Investment: ${results.investmentAmount.toFixed(2)}
              </Text>
              <Text style={[styles.resultText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Coins Owned: {results.coinsOwned.toFixed(6)} {selectedCoin.symbol.toUpperCase()}
              </Text>
            </View>
            
            {results.scenarios.map((scenario, index) => (
              <View key={index} style={[styles.scenarioCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                <Text style={[styles.scenarioName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {scenario.name}
                </Text>
                <Text style={[styles.scenarioValue, { color: '#10B981' }]}>
                  ${scenario.futureValue.toFixed(2)}
                </Text>
                <Text style={[styles.scenarioProfit, { color: '#10B981' }]}>
                  Profit: +${scenario.profit.toFixed(2)} (+{scenario.profitPercentage}%)
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* DCA Calculator */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Dollar Cost Averaging (DCA)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#111827',
                borderColor: '#374151'
              }
            ]}
            placeholder="Monthly DCA amount ($)"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={dcaAmount}
            onChangeText={setDcaAmount}
            keyboardType="numeric"
          />
          
          <View style={styles.periodSelector}>
            {['weekly', 'monthly'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { 
                    backgroundColor: dcaPeriod === period ? '#10B981' : 'transparent',
                    borderColor: '#10B981'
                  }
                ]}
                onPress={() => setDcaPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  { color: dcaPeriod === period ? '#FFFFFF' : '#10B981' }
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateDCA}
          >
            <Text style={styles.calculateButtonText}>Calculate DCA</Text>
          </TouchableOpacity>
        </View>

        {/* Educational Note */}
        <View style={styles.section}>
          <View style={[styles.noteCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.noteTitle, { color: '#92400E' }]}>⚠️ Important Note</Text>
            <Text style={[styles.noteText, { color: '#92400E' }]}>
              These calculations are for educational purposes only. Cryptocurrency investments are highly volatile and risky. 
              Past performance does not guarantee future results. Always do your own research and never invest more than you can afford to lose.
            </Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coinSelector: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  coinSelectorText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  coinPrice: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  calculateButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  scenarioCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scenarioValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scenarioProfit: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CalculatorPage;

// Defines the structure of our data
export interface MarketDataItem {
  id: string;
  symbol: string;
  price: number;
  change: number; // Daily percentage change
  isUp: boolean;
  volume: number;
  marketCap: number;
}

export interface BalanceData {
  total: number;
  changeValue: number;
  changePercent: number;
  isUp: boolean;
}

// Initial data set
let currentMarketData: MarketDataItem[] = [
    { id: 'btc', symbol: 'BTC/USD', price: 67432.50, change: 2.34, isUp: true, volume: 2.1e9, marketCap: 1.3e12 },
    { id: 'eth', symbol: 'ETH/USD', price: 3456.78, change: 1.45, isUp: true, volume: 1.2e9, marketCap: 415e9 },
    { id: 'xrp', symbol: 'XRP/USD', price: 0.6234, change: 3.45, isUp: true, volume: 890e6, marketCap: 35e9 },
    { id: 'ada', symbol: 'ADA/USD', price: 0.4567, change: -1.23, isUp: false, volume: 320e6, marketCap: 16e9 },
    { id: 'dot', symbol: 'DOT/USD', price: 7.8901, change: 4.67, isUp: true, volume: 245e6, marketCap: 9.8e9 },
    { id: 'link', symbol: 'LINK/USD', price: 14.56, change: 2.89, isUp: true, volume: 180e6, marketCap: 8.2e9 },
];

let currentBalance: BalanceData = {
    total: 124567.89,
    changeValue: 2456.78,
    changePercent: 2.01,
    isUp: true,
};

// Function to simulate price fluctuations
const simulateFluctuation = (value: number, volatility: number = 0.005): number => {
  const changePercent = (Math.random() - 0.5) * volatility;
  return value * (1 + changePercent);
};

// Generates a new set of data based on the previous state
export const MarketService = {
  fetchData: (): { balance: BalanceData; market: MarketDataItem[] } => {
    // Simulate balance change
    const newTotal = simulateFluctuation(currentBalance.total, 0.001);
    const changeValue = newTotal - currentBalance.total + currentBalance.changeValue;
    const changePercent = (changeValue / (newTotal - changeValue)) * 100;
    currentBalance = {
      total: newTotal,
      changeValue,
      changePercent,
      isUp: changeValue >= 0,
    };

    // Simulate market data change
    currentMarketData = currentMarketData.map(item => {
      const newPrice = simulateFluctuation(item.price);
      const newChange = item.change + (newPrice - item.price) / item.price * 100;
      return {
        ...item,
        price: newPrice,
        change: newChange,
        isUp: newPrice >= item.price,
      };
    });

    return { balance: { ...currentBalance }, market: [...currentMarketData] };
  },
};

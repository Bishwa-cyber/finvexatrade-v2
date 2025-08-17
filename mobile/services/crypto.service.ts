import axios from 'axios';
import Constants from 'expo-constants';

// --- CONFIGURATION ---
const API_KEY = Constants.expoConfig?.extra?.coingeckoApiKey;
const API_URL = 'https://api.coingecko.com/api/v3';

// Add a debug message to confirm the key is loaded
if (!API_KEY) {
  console.error(
    "FATAL: CoinGecko API Key is not loaded from app.json. Please ensure it's set under 'extra' and that you've restarted your server."
  );
} else {
  console.log("Crypto Service: API Key loaded successfully from app.json.");
}

// --- DATA INTERFACES ---
// Defines the shape of data from the /search endpoint
export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

// Defines the shape of data from the /coins/markets endpoint
export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    small: string; // The coin's image
    data: {
      price: number;
      price_btc: number;
      sparkline_7d: {
        price: number[];
      };
    };
  };
}

// --- AXIOS INSTANCE ---
// Creates a single, configured instance for all API calls
const cryptoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'x-cg-demo-api-key': API_KEY,
  },
});

// --- API FUNCTIONS ---

/**
 * Searches for coins based on a user's query.
 * This is used by your Search Page.
 * @param query The search term from the user.
 * @returns A list of coins matching the query.
 */
const searchCoins = async (query: string): Promise<CoinSearchResult[]> => {
  if (!query || !API_KEY) return [];
  try {
    const response = await cryptoApi.get('/search', { params: { query } });
    return response.data.coins || [];
  } catch (error) {
    console.error('Error searching coins:', error);
    throw new Error('Failed to fetch search results.');
  }
};


const getTrendingCoins = async (): Promise<TrendingCoin[]> => {
  if (!API_KEY) return [];
  try {
    const response = await cryptoApi.get('/search/trending');
    return response.data.coins || [];
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw new Error('Failed to fetch trending coins data.');
  }
};
/**
 * Fetches detailed market data for a list of specific coin IDs.
 * This is used by your Search Page after getting results from searchCoins.
 * @param coinIds An array of coin IDs from the search result.
 * @returns A list of coins with their market data.
 */
const getMarkets = async (coinIds: string[]): Promise<CoinMarketData[]> => {
  if (coinIds.length === 0 || !API_KEY) return [];
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: coinIds.join(','),
        price_change_percentage: '24h',
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data.');
  }
};

/**
 * Fetches the top N coins by market cap.
 * This is used by your Homepage.
 * @param limit The number of coins to fetch (e.g., 20).
 * @returns A list of top coins with their market data.
 */
const getTopCoins = async (limit: number = 20): Promise<CoinMarketData[]> => {
  if (!API_KEY) return [];
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        price_change_percentage: '24h',
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw new Error('Failed to fetch top coins data.');
  }
};

// --- EXPORTED SERVICE ---
// Bundles all functions into a single service object for use in your app
export const CryptoService = {
  searchCoins,
  getMarkets,
  getTopCoins,
  getTrendingCoins, // <-- Add the new function here
};
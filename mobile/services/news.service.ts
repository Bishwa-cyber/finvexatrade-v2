import axios from 'axios';
import Constants from 'expo-constants';

// --- API Keys and URLs ---
const ALPHA_VANTAGE_API_KEY = Constants.expoConfig?.extra?.alphaVantageApiKey;
const CRYPTO_COMPARE_API_KEY = Constants.expoConfig?.extra?.cryptoCompareApiKey;

const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';
const CRYPTO_COMPARE_API_URL = 'https://min-api.cryptocompare.com/data/v2/news/';

// --- Unified Article Interface ---
// This remains the same, allowing our UI to work without changes.
export interface Article {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedOn: number; // Unix timestamp
  categories: string[];
}

// --- Fetching and Transforming Functions ---

const fetchCryptoNews = async (): Promise<Article[]> => {
  if (!CRYPTO_COMPARE_API_KEY) return [];
  try {
    const response = await axios.get(`?lang=EN&api_key=${CRYPTO_COMPARE_API_KEY}`, { baseURL: CRYPTO_COMPARE_API_URL });
    return response.data.Data.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      imageUrl: item.imageurl,
      source: item.source,
      publishedOn: item.published_on,
      categories: ['Crypto'],
    }));
  } catch (error) {
    console.error("Error fetching Crypto news:", error);
    return [];
  }
};

// --- THIS IS THE UPDATED FUNCTION ---
const fetchStockNews = async (): Promise<Article[]> => {
  if (!ALPHA_VANTAGE_API_KEY) return [];
  try {
    const response = await axios.get(ALPHA_VANTAGE_API_URL, {
      params: {
        function: 'NEWS_SENTIMENT',
        topics: 'financial_markets', // Fetch general market news
        limit: '25', // Get the latest 25 articles
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    // Transform the Alpha Vantage data to our unified Article interface
    return response.data.feed.map(item => ({
      id: item.url, // Use URL as a unique ID
      title: item.title,
      url: item.url,
      imageUrl: item.banner_image,
      source: item.source,
      // Convert the Alpha Vantage time format (YYYYMMDD'T'HHMMSS) to a Unix timestamp
      publishedOn: Math.floor(new Date(
          `${item.time_published.slice(0, 4)}-${item.time_published.slice(4, 6)}-${item.time_published.slice(6, 8)}`
      ).getTime() / 1000),
      categories: ['Stocks'],
    }));
  } catch (error) {
    console.error("Error fetching Stock news from Alpha Vantage:", error);
    return [];
  }
};

const getAllNews = async (): Promise<Article[]> => {
  // Fetch from both sources in parallel for better performance
  const [cryptoNews, stockNews] = await Promise.all([
    fetchCryptoNews(),
    fetchStockNews()
  ]);

  // Combine and sort the articles, newest first
  const allNews = [...cryptoNews, ...stockNews];
  allNews.sort((a, b) => b.publishedOn - a.publishedOn);

  return allNews;
};

export const NewsService = {
  getAllNews,
};

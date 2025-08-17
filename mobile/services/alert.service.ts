import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoinMarketData } from './crypto.service'; // We'll use this for coin details

const ALERTS_STORAGE_KEY = 'finvexa-price-alerts';

// Define the structure of a price alert
export interface PriceAlert {
  id: string; // A unique ID for the alert, e.g., a timestamp
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  targetPrice: number;
  condition: 'above' | 'below'; // The trigger condition
  createdAt: string;
}

/**
 * Retrieves all saved price alerts from device storage.
 */
const getAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALERTS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load alerts.", e);
    return [];
  }
};

/**
 * Saves a new price alert to device storage.
 */
const saveAlert = async (newAlert: PriceAlert): Promise<void> => {
  try {
    const existingAlerts = await getAlerts();
    const updatedAlerts = [newAlert, ...existingAlerts];
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  } catch (e) {
    console.error("Failed to save alert.", e);
    throw new Error("Could not save the alert.");
  }
};

/**
 * Deletes a specific price alert from device storage.
 */
const deleteAlert = async (alertId: string): Promise<PriceAlert[]> => {
  try {
    const existingAlerts = await getAlerts();
    const updatedAlerts = existingAlerts.filter(alert => alert.id !== alertId);
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
    return updatedAlerts;
  } catch (e) {
    console.error("Failed to delete alert.", e);
    throw new Error("Could not delete the alert.");
  }
};

export const AlertService = {
  getAlerts,
  saveAlert,
  deleteAlert,
};

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'finvexa-app-theme';

// Define the shape of the context
interface ThemeContextType {
  theme: 'light' | 'dark';
  isThemeLoading: boolean; // To handle initial load
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Gets 'light' or 'dark' from OS settings
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Effect to load the saved theme from storage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
      } finally {
        setIsThemeLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Effect to save the theme to storage whenever it changes
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  // While loading the theme, you can return a loading screen or null
  if (isThemeLoading) {
    return null; // or a loading component like <ActivityIndicator />
  }

  return (
    <ThemeContext.Provider value={{ theme, isThemeLoading, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

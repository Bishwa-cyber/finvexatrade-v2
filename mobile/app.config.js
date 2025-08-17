import 'dotenv/config';

export default {
  expo: {
    name: "Finvexa Trade",
    slug: "finvexa-trade",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "finvexa",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    supportsTablet: true,

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#0b101a"
        }
      ],
      "expo-web-browser"
    ],

    experiments: {
      typedRoutes: true
    },

    // Secure API key loading from .env
    extra: {
      coingeckoApiKey: process.env.COINGECKO_API_KEY,
      cryptoCompareApiKey: process.env.CRYPTO_COMPARE_API_KEY,
      alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  },
};

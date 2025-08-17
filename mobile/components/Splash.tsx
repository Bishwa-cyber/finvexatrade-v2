import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto hide
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

interface SplashProps {
  onFinish: () => void;
}

// Trading Icons for Animation
const TradingIcon = ({ size = 40, color = '#06B6D4', style = {} }) => (
  <Animated.View style={[{ position: 'absolute' }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3V21H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9L12 6L16 10L20 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </Animated.View>
);

const CryptoIcon = ({ size = 35, color = '#F7931A', style = {} }) => (
  <Animated.View style={[{ position: 'absolute' }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M8 12H12M12 8H16M12 16H16M12 8V16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </Animated.View>
);

const PortfolioIcon = ({ size = 38, color = '#8B5CF6', style = {} }) => (
  <Animated.View style={[{ position: 'absolute' }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 17L12 22L22 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </Animated.View>
);

const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Floating icons animations
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    const startAnimations = async () => {
      // Logo entrance
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Text appears after logo
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }, 500);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Floating animations
      Animated.loop(
        Animated.timing(float1, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(float2, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(float3, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ).start();

      // Rotation animations
      Animated.loop(
        Animated.timing(rotate1, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(rotate2, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimations();

    // Hide splash after 3 seconds
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Interpolated values for floating animations
  const float1Y = float1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  const float2Y = float2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -15, 0],
  });

  const float3Y = float3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -25, 0],
  });

  const rotate1Deg = rotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotate2Deg = rotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#000000', '#0F172A', '#1E293B', '#000000']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.bgCircle,
          {
            transform: [
              { scale: pulseAnim },
              { rotate: rotate1Deg },
            ],
          },
        ]}
      />

      {/* Floating Trading Icons */}
      <TradingIcon
        size={45}
        color="#06B6D4"
        style={[
          { top: height * 0.2, left: width * 0.15 },
          { transform: [{ translateY: float1Y }, { rotate: rotate1Deg }] },
        ]}
      />

      <CryptoIcon
        size={40}
        color="#F7931A"
        style={[
          { top: height * 0.25, right: width * 0.2 },
          { transform: [{ translateY: float2Y }] },
        ]}
      />

      <PortfolioIcon
        size={42}
        color="#8B5CF6"
        style={[
          { bottom: height * 0.3, left: width * 0.1 },
          { transform: [{ translateY: float3Y }, { rotate: rotate2Deg }] },
        ]}
      />

      <TradingIcon
        size={38}
        color="#10B981"
        style={[
          { bottom: height * 0.25, right: width * 0.15 },
          { transform: [{ translateY: float1Y }] },
        ]}
      />

      <CryptoIcon
        size={35}
        color="#EF4444"
        style={[
          { top: height * 0.4, left: width * 0.05 },
          { transform: [{ translateY: float2Y }, { rotate: rotate2Deg }] },
        ]}
      />

      <PortfolioIcon
        size={40}
        color="#F59E0B"
        style={[
          { top: height * 0.45, right: width * 0.08 },
          { transform: [{ translateY: float3Y }] },
        ]}
      />

      {/* Main Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>F</Text>
        </View>
      </Animated.View>

      {/* Brand Name */}
      <Animated.View
        style={[
          styles.brandContainer,
          { opacity: textOpacity },
        ]}
      >
        <Text style={styles.brandName}>Finvexa</Text>
        <Text style={styles.brandSubtitle}>Trade</Text>
        <View style={styles.brandLine} />
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineContainer,
          { opacity: textOpacity },
        ]}
      >
        <Text style={styles.tagline}>Empower Your Trades</Text>
        <Text style={styles.subTagline}>Professional Trading Platform</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          { opacity: textOpacity },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Version */}
      <Animated.View
        style={[
          styles.versionContainer,
          { opacity: textOpacity },
        ]}
      >
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  bgCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.1)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#06B6D4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(6, 182, 212, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brandSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#06B6D4',
    letterSpacing: 4,
    marginTop: 5,
  },
  brandLine: {
    width: 60,
    height: 3,
    backgroundColor: '#06B6D4',
    marginTop: 10,
    borderRadius: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 120,
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: 2,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default Splash;

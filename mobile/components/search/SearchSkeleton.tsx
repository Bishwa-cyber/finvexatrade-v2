import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonItem = ({ isDark }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.skeletonItem, { opacity, backgroundColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
      </View>
      <View style={styles.skeletonPrice}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '70%' }]} />
      </View>
    </Animated.View>
  );
};

export const SearchSkeleton: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <View>{[...Array(6)].map((_, i) => <SkeletonItem key={i} isDark={isDark} />)}</View>
);

const styles = StyleSheet.create({
  skeletonItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, borderRadius: 12 },
  skeletonImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  skeletonInfo: { flex: 1 },
  skeletonPrice: { alignItems: 'flex-end', flex: 0.7 },
  skeletonLine: { height: 12, borderRadius: 4, backgroundColor: '#374151', marginBottom: 8 },
});

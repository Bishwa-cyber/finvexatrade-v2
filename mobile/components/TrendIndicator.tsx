import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const UpArrow = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" fill={color} />
  </Svg>
);

const DownArrow = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 20l-8-8h6V4h4v8h6l-8 8z" fill={color} />
  </Svg>
);

interface TrendIndicatorProps {
  isUp: boolean;
  value: string;
  isDark: boolean;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ isUp, value, isDark }) => {
  const color = isUp ? '#10B981' : '#EF4444';
  return (
    <View style={styles.container}>
      {isUp ? <UpArrow size={16} color={color} /> : <DownArrow size={16} color={color} />}
      <Text style={[styles.text, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
});

export default React.memo(TrendIndicator);

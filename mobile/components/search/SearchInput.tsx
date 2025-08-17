import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SearchIcon = ({ size = 20, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" /><Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" /></Svg> );
const ClearIcon = ({ size = 20, color }) => ( <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" /><Path d="m15 9-6 6M9 9l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" /></Svg> );

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isDark: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ query, setQuery, isDark }) => (
  <View style={styles.searchContainer}>
    <View style={styles.iconContainer}>
      <SearchIcon color={isDark ? '#6B7280' : '#9CA3AF'} />
    </View>
    <TextInput
      style={[styles.searchInput, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#111827' }]}
      placeholder="Search for Bitcoin, Ethereum..."
      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      value={query}
      onChangeText={setQuery}
      autoCapitalize="none"
      autoCorrect={false}
    />
    {query.length > 0 && (
      <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
        <ClearIcon color={isDark ? '#6B7280' : '#9CA3AF'} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  searchContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  iconContainer: { position: 'absolute', left: 16, zIndex: 1 },
  searchInput: { flex: 1, height: 50, paddingLeft: 50, paddingRight: 50, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#374151' },
  clearButton: { position: 'absolute', right: 16 },
});

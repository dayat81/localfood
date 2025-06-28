import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

interface RecentSearchesProps {
  searches: string[];
  onSearchPress: (query: string) => void;
  onClearAll?: () => void;
  maxItems?: number;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSearchPress,
  onClearAll,
  maxItems = 10,
}) => {
  if (searches.length === 0) {
    return null;
  }

  const displaySearches = searches.slice(0, maxItems);

  const renderSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => onSearchPress(item)}
    >
      <Text style={styles.searchIcon}>🕐</Text>
      <Text style={styles.searchText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        {onClearAll && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={displaySearches}
        renderItem={renderSearchItem}
        keyExtractor={(item, index) => `recent-${index}-${item}`}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#666666',
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 44, // Align with text, accounting for icon
  },
});

export default RecentSearches;
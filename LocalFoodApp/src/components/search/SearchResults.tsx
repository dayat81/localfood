import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ProductCard from '../products/ProductCard';

interface SearchResult {
  id: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  };
  thumbnail?: string;
  category?: string;
  inStock?: boolean;
  type: 'product' | 'restaurant' | 'category';
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  query,
  onLoadMore,
  hasMore = false,
}) => {
  const renderResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'product') {
      return (
        <ProductCard
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          thumbnail={item.thumbnail}
          category={item.category}
          inStock={item.inStock}
        />
      );
    }

    // For now, we'll just render products
    // In the future, we can add restaurant and category cards
    return null;
  };

  const renderHeader = () => {
    if (loading && results.length === 0) return null;
    
    return (
      <View style={styles.header}>
        <Text style={styles.resultsCount}>
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || results.length === 0) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (!query) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>Start searching</Text>
          <Text style={styles.emptyStateText}>
            Search for your favorite food, restaurants, or cuisines
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>😕</Text>
        <Text style={styles.emptyStateTitle}>No results found</Text>
        <Text style={styles.emptyStateText}>
          Try searching for something else or check your spelling
        </Text>
      </View>
    );
  };

  if (results.length === 0) {
    return renderEmptyState();
  }

  return (
    <FlatList
      data={results}
      renderItem={renderResult}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default SearchResults;
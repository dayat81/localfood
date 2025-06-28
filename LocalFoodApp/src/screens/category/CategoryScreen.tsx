import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../types';
import { AppDispatch, RootState } from '../../store';
import {
  fetchProducts,
  setSelectedCategory,
  setSortBy,
  setPage,
} from '../../store/slices/productSlice';
import ProductCard from '../../components/products/ProductCard';
import ProductListHeader from '../../components/products/ProductListHeader';

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;
type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

interface Props {
  navigation: CategoryScreenNavigationProp;
  route: CategoryScreenRouteProp;
}

const CategoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    categories,
    loading,
    error,
    pagination,
    sortBy,
  } = useSelector((state: RootState) => state.products);

  const [refreshing, setRefreshing] = useState(false);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: categoryName || 'Category',
    });
  }, [navigation, categoryName]);

  // Set category filter and fetch products
  useEffect(() => {
    if (categoryId) {
      dispatch(setSelectedCategory(categoryId));
      dispatch(setPage(1));
      dispatch(fetchProducts());
    }
  }, [dispatch, categoryId]);

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, [dispatch]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    dispatch(setSortBy(newSort));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle pagination
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore && products.length > 0) {
      dispatch(setPage(pagination.currentPage + 1));
      dispatch(fetchProducts());
    }
  }, [dispatch, loading, pagination, products.length]);

  // Render product item
  const renderProduct = ({ item }: { item: any }) => {
    const price = item.pricing?.priceRange?.start;
    return (
      <ProductCard
        id={item.id}
        name={item.name}
        description={item.description}
        price={{
          amount: price?.gross?.amount || 0,
          currency: price?.gross?.currency || 'USD',
        }}
        thumbnail={item.thumbnail?.url}
        category={item.category?.name}
        inStock={item.isAvailable}
      />
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          No products found in this category
        </Text>
      </View>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!loading || products.length === 0) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  // Render error state
  if (error && products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProductListHeader
        totalCount={pagination.total}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default CategoryScreen;
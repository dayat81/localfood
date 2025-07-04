import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../types';
import { AppDispatch, RootState } from '../../store';
import {
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  setSortBy,
  setPage,
} from '../../store/slices/productSlice';
import ProductCard from '../../components/products/ProductCard';
import ProductListHeader from '../../components/products/ProductListHeader';
import ProductFilters from '../../components/products/ProductFilters';
import LocationSelector from '../../components/location/LocationSelector';
import RestaurantDistanceFilter from '../../components/location/RestaurantDistanceFilter';

type ProductListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductList'>;
type ProductListScreenRouteProp = RouteProp<RootStackParamList, 'ProductList'>;

interface Props {
  navigation: ProductListScreenNavigationProp;
  route: ProductListScreenRouteProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    categories,
    loading,
    error,
    pagination,
    selectedCategory,
    sortBy,
  } = useSelector((state: RootState) => state.products);

  const { currentLocation, selectedRadius } = useSelector(
    (state: RootState) => state.location
  );

  const [refreshing, setRefreshing] = useState(false);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

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

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    dispatch(setSelectedCategory(categoryId));
    dispatch(setPage(1));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle pagination
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore && products.length > 0) {
      dispatch(setPage(pagination.currentPage + 1));
      dispatch(fetchProducts());
    }
  }, [dispatch, loading, pagination, products.length]);

  // Handle location change
  const handleLocationChange = useCallback(() => {
    // Refresh products when location changes
    dispatch(setPage(1));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle radius change
  const handleRadiusChange = useCallback((radius: number) => {
    // Refresh products when radius changes
    dispatch(setPage(1));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Set navigation options with search button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate('Search', {})}
        >
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Render product item
  const renderProduct = ({ item }: { item: any }) => {
    const price = item.pricing?.priceRange?.start;
    // Mock rating data - in real app this would come from the API
    const mockRating = Math.random() * 2 + 3; // Rating between 3-5
    const mockReviewCount = Math.floor(Math.random() * 100) + 1;
    
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
        rating={mockRating}
        reviewCount={mockReviewCount}
      />
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {selectedCategory ? 'No products found in this category' : 'No products available'}
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
      <LocationSelector onLocationChange={handleLocationChange} />
      
      <ProductListHeader
        totalCount={pagination.total}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      
      <ProductFilters
        categories={categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          count: cat.products?.totalCount,
        }))}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <RestaurantDistanceFilter onRadiusChange={handleRadiusChange} />

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

export default ProductListScreen;
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { RootStackParamList } from '../../types';
import { AppDispatch, RootState } from '../../store';
import {
  setQuery,
  setFilter,
  clearFilters,
  clearResults,
  performSearch,
  getSearchSuggestions,
  loadRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
} from '../../store/slices/searchSlice';
import SearchBar from '../../components/search/SearchBar';
import SearchResults from '../../components/search/SearchResults';
import SearchFilters from '../../components/search/SearchFilters';
import RecentSearches from '../../components/search/RecentSearches';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
  route: SearchScreenRouteProp;
}

const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    query,
    results,
    suggestions,
    recentSearches,
    loading,
    error,
    filters,
    pagination,
  } = useSelector((state: RootState) => state.search);

  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    dispatch(loadRecentSearches());
  }, [dispatch]);

  // Debounced search suggestions
  const debouncedGetSuggestions = useDebouncedCallback((searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      dispatch(getSearchSuggestions(searchQuery));
    }
  }, 300);

  // Handle query change
  const handleQueryChange = useCallback((text: string) => {
    dispatch(setQuery(text));
    debouncedGetSuggestions(text);
  }, [dispatch, debouncedGetSuggestions]);

  // Handle search execution
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();
    setIsSearchFocused(false);
    
    // Save to recent searches
    await dispatch(saveRecentSearch(searchQuery));
    
    // Perform search
    await dispatch(performSearch({ 
      query: searchQuery, 
      page: 1,
      filters 
    }));
  }, [dispatch, filters]);

  // Handle load more results
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore && query.trim()) {
      dispatch(performSearch({ 
        query, 
        page: pagination.currentPage + 1,
        filters 
      }));
    }
  }, [dispatch, loading, pagination, query, filters]);

  // Handle filter change
  const handleFilterChange = useCallback((filterType: string, value: string | null) => {
    dispatch(setFilter({ key: filterType, value }));
    
    // Re-search with new filters if we have a query
    if (query.trim()) {
      dispatch(performSearch({ 
        query, 
        page: 1,
        filters: { ...filters, [filterType]: value }
      }));
    }
  }, [dispatch, query, filters]);

  // Handle clear all filters
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    
    // Re-search without filters if we have a query
    if (query.trim()) {
      dispatch(performSearch({ 
        query, 
        page: 1,
        filters: {}
      }));
    }
  }, [dispatch, query]);

  // Handle recent search press
  const handleRecentSearchPress = useCallback((searchQuery: string) => {
    dispatch(setQuery(searchQuery));
    handleSearch(searchQuery);
  }, [dispatch, handleSearch]);

  // Handle clear recent searches
  const handleClearRecentSearches = useCallback(() => {
    dispatch(clearRecentSearches());
  }, [dispatch]);

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  // Handle search blur
  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    dispatch(clearResults());
    navigation.goBack();
  }, [dispatch, navigation]);

  // Mock filter data
  const mockFilters = useMemo(() => ({
    categories: [
      { id: 'pizza', label: 'Pizza', count: 15 },
      { id: 'burger', label: 'Burgers', count: 8 },
      { id: 'sushi', label: 'Sushi', count: 12 },
      { id: 'pasta', label: 'Pasta', count: 6 },
    ],
    priceRanges: [
      { id: 'under-15', label: 'Under $15' },
      { id: '15-30', label: '$15 - $30' },
      { id: '30-50', label: '$30 - $50' },
      { id: 'over-50', label: 'Over $50' },
    ],
    ratings: [
      { id: '4+', label: '4+ Stars' },
      { id: '3+', label: '3+ Stars' },
      { id: '2+', label: '2+ Stars' },
    ],
    features: [
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'gluten-free', label: 'Gluten Free' },
      { id: 'delivery', label: 'Delivery' },
      { id: 'pickup', label: 'Pickup' },
    ],
  }), []);

  // Show suggestions or recent searches when focused and no results
  const showSuggestionsOrRecent = isSearchFocused && results.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={handleQueryChange}
        onSearch={handleSearch}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        onCancel={handleCancel}
        showCancelButton={true}
        autoFocus={true}
      />

      {showFilters && (
        <SearchFilters
          filters={mockFilters}
          selectedFilters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />
      )}

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            Filters {showFilters ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {showSuggestionsOrRecent ? (
          <View>
            {suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSearch(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <RecentSearches
              searches={recentSearches}
              onSearchPress={handleRecentSearchPress}
              onClearAll={handleClearRecentSearches}
            />
          </View>
        ) : (
          <SearchResults
            results={results}
            loading={loading}
            query={query}
            onLoadMore={handleLoadMore}
            hasMore={pagination.hasMore}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default SearchScreen;
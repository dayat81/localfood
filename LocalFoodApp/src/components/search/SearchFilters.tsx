import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface Filter {
  id: string;
  label: string;
  count?: number;
}

interface SearchFiltersProps {
  filters: {
    categories?: Filter[];
    priceRanges?: Filter[];
    ratings?: Filter[];
    features?: Filter[];
  };
  selectedFilters: {
    category?: string;
    priceRange?: string;
    rating?: string;
    features?: string[];
  };
  onFilterChange: (filterType: string, value: string | null) => void;
  onClearAll?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
}) => {
  const hasActiveFilters = Object.values(selectedFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null
  );

  const renderFilterChips = (
    items: Filter[] = [],
    selectedValue: string | undefined,
    filterType: string
  ) => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.filterChip,
            selectedValue === item.id && styles.filterChipActive,
          ]}
          onPress={() => 
            onFilterChange(
              filterType, 
              selectedValue === item.id ? null : item.id
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              selectedValue === item.id && styles.filterTextActive,
            ]}
          >
            {item.label}
          </Text>
          {item.count !== undefined && (
            <Text
              style={[
                styles.countText,
                selectedValue === item.id && styles.filterTextActive,
              ]}
            >
              ({item.count})
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        {hasActiveFilters && onClearAll && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {filters.categories && filters.categories.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {renderFilterChips(filters.categories, selectedFilters.category, 'category')}
        </View>
      )}

      {filters.priceRanges && filters.priceRanges.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          {renderFilterChips(filters.priceRanges, selectedFilters.priceRange, 'priceRange')}
        </View>
      )}

      {filters.ratings && filters.ratings.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Rating</Text>
          {renderFilterChips(filters.ratings, selectedFilters.rating, 'rating')}
        </View>
      )}

      {filters.features && filters.features.length > 0 && (
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            {filters.features.map((item) => {
              const isSelected = selectedFilters.features?.includes(item.id) || false;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => {
                    const currentFeatures = selectedFilters.features || [];
                    const newFeatures = isSelected
                      ? currentFeatures.filter(f => f !== item.id)
                      : [...currentFeatures, item.id];
                    onFilterChange('features', newFeatures.join(','));
                  }}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  clearText: {
    fontSize: 14,
    color: '#007AFF',
  },
  filterSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  chipScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  countText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
});

export default SearchFilters;
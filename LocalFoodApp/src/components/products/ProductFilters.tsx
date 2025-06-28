import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | null) => void;
  priceRange?: {
    min: number;
    max: number;
  };
  onPriceRangeChange?: (min: number, max: number) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategory && styles.filterChipActive
          ]}
          onPress={() => onCategoryChange(null)}
        >
          <Text style={[
            styles.filterText,
            !selectedCategory && styles.filterTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              selectedCategory === category.id && styles.filterChipActive
            ]}
            onPress={() => onCategoryChange(category.id)}
          >
            <Text style={[
              styles.filterText,
              selectedCategory === category.id && styles.filterTextActive
            ]}>
              {category.name}
            </Text>
            {category.count !== undefined && (
              <Text style={[
                styles.countText,
                selectedCategory === category.id && styles.filterTextActive
              ]}>
                ({category.count})
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterScroll: {
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

export default ProductFilters;
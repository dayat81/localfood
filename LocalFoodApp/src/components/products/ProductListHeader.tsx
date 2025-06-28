import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface ProductListHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  totalCount,
  sortBy,
  onSortChange,
}) => {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'created_at', label: 'Newest' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>
        {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
      </Text>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // Cycle through sort options
            const currentIndex = sortOptions.findIndex(opt => opt.value === sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            onSortChange(sortOptions[nextIndex].value);
          }}
        >
          <Text style={styles.sortButtonText}>
            {sortOptions.find(opt => opt.value === sortBy)?.label || 'Name'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  countText: {
    fontSize: 14,
    color: '#666666',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ProductListHeader;
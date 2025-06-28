import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import CategoryIcon from './CategoryIcon';

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
}

interface CategoryGridProps {
  categories: Category[];
  numColumns?: number;
  onCategoryPress?: (category: Category) => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  numColumns = 2,
  onCategoryPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: Category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Navigate to Category screen
      navigation.navigate('Category', { 
        categoryId: category.id, 
        categoryName: category.name 
      });
    }
  };

  const cardWidth = (screenWidth - 48) / numColumns; // 48 = margin + padding

  const renderCategory = (category: Category, index: number) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        { width: cardWidth },
        index % numColumns !== numColumns - 1 && styles.cardMarginRight,
      ]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <CategoryIcon categoryName={category.name} size={40} />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {category.name}
      </Text>
      {category.productCount !== undefined && (
        <Text style={styles.productCount}>
          {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category, index) => renderCategory(category, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardMarginRight: {
    marginRight: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 34, // Ensure consistent height for 2 lines
  },
  productCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CategoryGrid;
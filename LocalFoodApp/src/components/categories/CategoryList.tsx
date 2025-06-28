import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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

interface CategoryListProps {
  categories: Category[];
  horizontal?: boolean;
  onCategoryPress?: (category: Category) => void;
  showProductCount?: boolean;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  horizontal = false,
  onCategoryPress,
  showProductCount = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: Category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      navigation.navigate('Category', { 
        categoryId: category.id, 
        categoryName: category.name 
      });
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        horizontal && styles.horizontalItem,
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.iconContainer,
        horizontal && styles.horizontalIconContainer,
      ]}>
        <CategoryIcon 
          categoryName={item.name} 
          size={horizontal ? 32 : 40} 
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[
          styles.categoryName,
          horizontal && styles.horizontalCategoryName,
        ]} numberOfLines={horizontal ? 2 : 1}>
          {item.name}
        </Text>
        {item.description && !horizontal && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {showProductCount && item.productCount !== undefined && (
          <Text style={[
            styles.productCount,
            horizontal && styles.horizontalProductCount,
          ]}>
            {item.productCount} {item.productCount === 1 ? 'item' : 'items'}
          </Text>
        )}
      </View>
      {!horizontal && (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );

  if (horizontal) {
    return (
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      />
    );
  }

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  horizontalContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  horizontalItem: {
    width: 120,
    flexDirection: 'column',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  horizontalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 0,
    marginBottom: 8,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  horizontalCategoryName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
    minHeight: 34,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  productCount: {
    fontSize: 14,
    color: '#999999',
  },
  horizontalProductCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  chevron: {
    fontSize: 20,
    color: '#999999',
    marginLeft: 8,
  },
});

export default CategoryList;
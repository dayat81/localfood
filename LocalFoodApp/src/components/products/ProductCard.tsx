import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import RatingStars from '../ratings/RatingStars';

interface ProductCardProps {
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
  rating?: number;
  reviewCount?: number;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'ProductList'>;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  thumbnail,
  category,
  inStock = true,
  rating,
  reviewCount,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: id });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!inStock}
    >
      <Image
        source={
          thumbnail
            ? { uri: thumbnail }
            : require('../../assets/placeholder-food.png')
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        {category && (
          <Text style={styles.category}>
            {category}
          </Text>
        )}
        {rating && (
          <View style={styles.ratingContainer}>
            <RatingStars rating={rating} size="small" />
            {reviewCount && (
              <Text style={styles.reviewCount}>
                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </Text>
            )}
          </View>
        )}
        <View style={styles.footer}>
          <Text style={[styles.price, !inStock && styles.outOfStock]}>
            {formatPrice(price.amount, price.currency)}
          </Text>
          {!inStock && (
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  outOfStock: {
    color: '#999999',
  },
  outOfStockText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default ProductCard;
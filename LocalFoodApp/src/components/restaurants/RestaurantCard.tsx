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
import { RootStackParamList } from '../../navigation/AppNavigator';
import { formatDistance } from '../../utils/location';
import RatingBadge from '../ratings/RatingBadge';

interface RestaurantCardProps {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  distance?: number; // in kilometers
  isOpen?: boolean;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'RestaurantList'>;

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  description,
  thumbnail,
  rating,
  deliveryTime,
  deliveryFee,
  distance,
  isOpen = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('RestaurantDetail', { restaurantId: id });
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isOpen && styles.closedContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!isOpen}
    >
      <Image
        source={
          thumbnail
            ? { uri: thumbnail }
            : require('../../assets/placeholder-restaurant.png')
        }
        style={styles.image}
        resizeMode="cover"
      />
      {!isOpen && (
        <View style={styles.closedOverlay}>
          <Text style={styles.closedText}>Closed</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {rating && (
            <RatingBadge 
              rating={rating} 
              size="small" 
              variant="compact"
            />
          )}
        </View>
        {description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
        <View style={styles.details}>
          {distance !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{formatDistance(distance)}</Text>
            </View>
          )}
          {deliveryTime && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{deliveryTime}</Text>
            </View>
          )}
          {deliveryFee !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚚</Text>
              <Text style={styles.detailText}>
                {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
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
  closedContainer: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default RestaurantCard;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingBadgeProps {
  rating: number;
  totalReviews?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'detailed';
}

const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  totalReviews,
  size = 'medium',
  variant = 'default',
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#4CAF50'; // Excellent - Green
    if (rating >= 4.0) return '#8BC34A'; // Very Good - Light Green
    if (rating >= 3.5) return '#FFC107'; // Good - Yellow
    if (rating >= 3.0) return '#FF9800'; // Fair - Orange
    return '#F44336'; // Poor - Red
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 6, paddingVertical: 2 },
          rating: { fontSize: 12 },
          text: { fontSize: 10 },
        };
      case 'large':
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6 },
          rating: { fontSize: 18 },
          text: { fontSize: 14 },
        };
      default:
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4 },
          rating: { fontSize: 14 },
          text: { fontSize: 12 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const backgroundColor = getRatingColor(rating);

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <Text style={[styles.rating, sizeStyles.rating]}>
            ⭐ {rating.toFixed(1)}
          </Text>
        );
      
      case 'detailed':
        return (
          <>
            <Text style={[styles.rating, sizeStyles.rating]}>
              {rating.toFixed(1)}
            </Text>
            <Text style={[styles.star, sizeStyles.rating]}>⭐</Text>
            {totalReviews !== undefined && (
              <Text style={[styles.reviewsText, sizeStyles.text]}>
                ({totalReviews})
              </Text>
            )}
          </>
        );
      
      default:
        return (
          <>
            <Text style={[styles.star, sizeStyles.rating]}>⭐</Text>
            <Text style={[styles.rating, sizeStyles.rating]}>
              {rating.toFixed(1)}
            </Text>
            {totalReviews !== undefined && (
              <Text style={[styles.reviewsText, sizeStyles.text]}>
                ({totalReviews})
              </Text>
            )}
          </>
        );
    }
  };

  return (
    <View style={[
      styles.container,
      sizeStyles.container,
      { backgroundColor },
    ]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  star: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 2,
  },
  rating: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  reviewsText: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginLeft: 4,
  },
});

export default RatingBadge;
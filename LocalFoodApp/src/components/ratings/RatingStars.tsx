import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showRatingText?: boolean;
  color?: string;
  emptyColor?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  showRatingText = false,
  color = '#FFD700',
  emptyColor = '#E0E0E0',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: 12, spacing: 2 };
      case 'large':
        return { fontSize: 20, spacing: 4 };
      default:
        return { fontSize: 16, spacing: 3 };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxRating - Math.ceil(rating);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={`full-${i}`} style={[styles.star, { fontSize: sizeStyles.fontSize, color }]}>
          ★
        </Text>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <View key="half" style={styles.halfStarContainer}>
          <Text style={[styles.star, { fontSize: sizeStyles.fontSize, color: emptyColor }]}>
            ★
          </Text>
          <Text style={[styles.halfStar, { fontSize: sizeStyles.fontSize, color }]}>
            ★
          </Text>
        </View>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} style={[styles.star, { fontSize: sizeStyles.fontSize, color: emptyColor }]}>
          ★
        </Text>
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.starsContainer, { gap: sizeStyles.spacing }]}>
        {renderStars()}
      </View>
      {showRatingText && (
        <Text style={[styles.ratingText, { fontSize: sizeStyles.fontSize * 0.8 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    lineHeight: undefined, // Let the system handle line height
  },
  halfStarContainer: {
    position: 'relative',
  },
  halfStar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    overflow: 'hidden',
  },
  ratingText: {
    marginLeft: 6,
    color: '#666666',
    fontWeight: '500',
  },
});

export default RatingStars;
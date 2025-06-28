import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingStars from './RatingStars';

interface RatingCategory {
  label: string;
  rating: number;
  color?: string;
}

interface RatingBreakdownProps {
  categories: RatingCategory[];
  totalRating: number;
  totalReviews: number;
  showOverallRating?: boolean;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  categories,
  totalRating,
  totalReviews,
  showOverallRating = true,
}) => {
  const getProgressBarColor = (rating: number) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 4.0) return '#8BC34A';
    if (rating >= 3.5) return '#FFC107';
    if (rating >= 3.0) return '#FF9800';
    return '#F44336';
  };

  const renderProgressBar = (rating: number, color?: string) => {
    const percentage = (rating / 5) * 100;
    const barColor = color || getProgressBarColor(rating);

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showOverallRating && (
        <View style={styles.overallSection}>
          <Text style={styles.overallRating}>{totalRating.toFixed(1)}</Text>
          <View style={styles.overallDetails}>
            <RatingStars rating={totalRating} size="large" showRatingText={false} />
            <Text style={styles.totalReviews}>
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Rating Breakdown</Text>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            {renderProgressBar(category.rating, category.color)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  overallSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  overallRating: {
    fontSize: 48,
    fontWeight: '700',
    color: '#333333',
    marginRight: 16,
  },
  overallDetails: {
    flex: 1,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  breakdownSection: {
    flex: 1,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  categoryRow: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4, // Ensure visibility even for very low ratings
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    minWidth: 32,
    textAlign: 'right',
  },
});

export default RatingBreakdown;
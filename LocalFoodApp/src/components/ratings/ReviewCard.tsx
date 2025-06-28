import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RatingStars from './RatingStars';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount?: number;
  orderItems?: string[];
}

interface ReviewCardProps {
  review: Review;
  showHelpfulCount?: boolean;
  showOrderItems?: boolean;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showHelpfulCount = true,
  showOrderItems = true,
  compact = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userAvatar ? (
            <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(review.userName)}</Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.date)}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <RatingStars rating={review.rating} size="small" />
        </View>
      </View>

      {!compact && showOrderItems && review.orderItems && review.orderItems.length > 0 && (
        <View style={styles.orderItems}>
          <Text style={styles.orderItemsLabel}>Ordered:</Text>
          <Text style={styles.orderItemsText}>
            {review.orderItems.join(', ')}
          </Text>
        </View>
      )}

      <Text style={[styles.comment, compact && styles.compactComment]} numberOfLines={compact ? 3 : undefined}>
        {review.comment}
      </Text>

      {!compact && showHelpfulCount && review.helpfulCount !== undefined && review.helpfulCount > 0 && (
        <View style={styles.footer}>
          <Text style={styles.helpfulText}>
            {review.helpfulCount} {review.helpfulCount === 1 ? 'person found' : 'people found'} this helpful
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  ratingContainer: {
    marginLeft: 12,
  },
  orderItems: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  orderItemsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2,
  },
  orderItemsText: {
    fontSize: 14,
    color: '#333333',
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    marginBottom: 12,
  },
  compactComment: {
    marginBottom: 0,
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  helpfulText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default ReviewCard;
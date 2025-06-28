import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setRadius } from '../../store/slices/locationSlice';

interface RestaurantDistanceFilterProps {
  onRadiusChange?: (radius: number) => void;
}

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
];

const RestaurantDistanceFilter: React.FC<RestaurantDistanceFilterProps> = ({
  onRadiusChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedRadius, currentLocation } = useSelector(
    (state: RootState) => state.location
  );

  const handleRadiusChange = (radius: number) => {
    dispatch(setRadius(radius));
    onRadiusChange?.(radius);
  };

  if (!currentLocation) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distance</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {RADIUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radiusChip,
              selectedRadius === option.value && styles.radiusChipActive,
            ]}
            onPress={() => handleRadiusChange(option.value)}
          >
            <Text
              style={[
                styles.radiusText,
                selectedRadius === option.value && styles.radiusTextActive,
              ]}
            >
              {option.label}
            </Text>
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
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  radiusChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  radiusChipActive: {
    backgroundColor: '#007AFF',
  },
  radiusText: {
    fontSize: 14,
    color: '#666666',
  },
  radiusTextActive: {
    color: '#FFFFFF',
  },
});

export default RestaurantDistanceFilter;
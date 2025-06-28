import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CategoryIconProps {
  categoryName: string;
  size?: number;
  color?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  size = 24,
  color = '#007AFF',
}) => {
  // Map category names to emoji icons
  const getCategoryIcon = (name: string): string => {
    const normalizedName = name.toLowerCase();
    
    // Food categories
    if (normalizedName.includes('pizza')) return '🍕';
    if (normalizedName.includes('burger') || normalizedName.includes('sandwich')) return '🍔';
    if (normalizedName.includes('sushi') || normalizedName.includes('japanese')) return '🍣';
    if (normalizedName.includes('pasta') || normalizedName.includes('italian')) return '🍝';
    if (normalizedName.includes('taco') || normalizedName.includes('mexican')) return '🌮';
    if (normalizedName.includes('curry') || normalizedName.includes('indian')) return '🍛';
    if (normalizedName.includes('salad') || normalizedName.includes('healthy')) return '🥗';
    if (normalizedName.includes('chicken') || normalizedName.includes('fried')) return '🍗';
    if (normalizedName.includes('seafood') || normalizedName.includes('fish')) return '🐟';
    if (normalizedName.includes('dessert') || normalizedName.includes('sweet')) return '🍰';
    if (normalizedName.includes('chinese')) return '🥡';
    if (normalizedName.includes('thai')) return '🍜';
    if (normalizedName.includes('korean')) return '🍲';
    if (normalizedName.includes('breakfast')) return '🍳';
    if (normalizedName.includes('coffee') || normalizedName.includes('cafe')) return '☕';
    if (normalizedName.includes('juice') || normalizedName.includes('smoothie')) return '🥤';
    if (normalizedName.includes('ice cream')) return '🍦';
    if (normalizedName.includes('donut') || normalizedName.includes('bakery')) return '🍩';
    if (normalizedName.includes('fruit')) return '🍎';
    if (normalizedName.includes('vegetarian') || normalizedName.includes('vegan')) return '🥬';
    if (normalizedName.includes('steak') || normalizedName.includes('bbq')) return '🥩';
    if (normalizedName.includes('soup')) return '🍲';
    if (normalizedName.includes('noodle')) return '🍜';
    if (normalizedName.includes('rice')) return '🍚';
    if (normalizedName.includes('bread')) return '🍞';
    
    // Beverage categories
    if (normalizedName.includes('beer') || normalizedName.includes('alcohol')) return '🍺';
    if (normalizedName.includes('wine')) return '🍷';
    if (normalizedName.includes('cocktail')) return '🍸';
    if (normalizedName.includes('tea')) return '🍵';
    if (normalizedName.includes('water')) return '💧';
    
    // Meal times
    if (normalizedName.includes('lunch')) return '🍽️';
    if (normalizedName.includes('dinner')) return '🍽️';
    if (normalizedName.includes('brunch')) return '🥐';
    
    // Fast food
    if (normalizedName.includes('fast food') || normalizedName.includes('quick')) return '🍟';
    
    // Default fallbacks
    if (normalizedName.includes('food')) return '🍽️';
    if (normalizedName.includes('drink') || normalizedName.includes('beverage')) return '🥤';
    
    // Generic food icon as ultimate fallback
    return '🍽️';
  };

  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {getCategoryIcon(categoryName)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default CategoryIcon;
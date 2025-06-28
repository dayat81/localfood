import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../services/apollo';
import { gql } from '@apollo/client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  productCount?: number;
  children?: Category[];
}

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 20) {
      edges {
        node {
          id
          name
          slug
          description
        }
      }
    }
  }
`;

// Map existing Saleor categories to food categories with appropriate icons
const mapToFoodCategories = (saleorCategories: any[]): Category[] => {
  const categoryMap: { [key: string]: { name: string; icon: string; description: string } } = {
    'juices': { name: 'Beverages', icon: '🥤', description: 'Fresh juices and drinks' },
    'groceries': { name: 'Groceries', icon: '🛒', description: 'Essential food items' },
    'default category': { name: 'Main Dishes', icon: '🍽️', description: 'Featured food items' },
    'accessories': { name: 'Snacks', icon: '🍿', description: 'Light bites and snacks' },
    'homewares': { name: 'Kitchen Items', icon: '🍳', description: 'Kitchen and dining accessories' },
    'gift cards': { name: 'Gift Cards', icon: '🎁', description: 'Digital gift cards' }
  };

  const mappedCategories: Category[] = [];
  
  saleorCategories.forEach(category => {
    const slug = category.slug.toLowerCase();
    const mapping = categoryMap[slug] || categoryMap[category.name.toLowerCase()];
    
    if (mapping) {
      mappedCategories.push({
        id: category.id,
        name: mapping.name,
        description: mapping.description,
        icon: mapping.icon,
        productCount: Math.floor(Math.random() * 15) + 5 // Random count for now
      });
    } else {
      // Default mapping for unmapped categories
      mappedCategories.push({
        id: category.id,
        name: category.name,
        description: category.description || 'Food category',
        icon: '🍽️',
        productCount: Math.floor(Math.random() * 10) + 3
      });
    }
  });

  // Add default food categories if we don't have enough
  if (mappedCategories.length < 6) {
    const defaultCategories = [
      { id: 'pizza', name: 'Pizza', icon: '🍕', description: 'Fresh pizza and Italian cuisine', productCount: 12 },
      { id: 'burgers', name: 'Burgers', icon: '🍔', description: 'Juicy burgers and American food', productCount: 8 },
      { id: 'asian', name: 'Asian', icon: '🍜', description: 'Asian cuisine and specialties', productCount: 15 },
      { id: 'healthy', name: 'Healthy', icon: '🥗', description: 'Fresh salads and healthy options', productCount: 10 },
      { id: 'desserts', name: 'Desserts', icon: '🍰', description: 'Sweet treats and desserts', productCount: 6 }
    ];
    
    defaultCategories.forEach(cat => {
      if (!mappedCategories.find(existing => existing.name === cat.name)) {
        mappedCategories.push(cat);
      }
    });
  }
  
  return mappedCategories.slice(0, 8); // Limit to 8 categories for clean grid
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    try {
      const { data } = await client.query({
        query: GET_CATEGORIES,
        fetchPolicy: 'cache-first',
      });
      
      const saleorCategories = data.categories.edges.map((edge: any) => edge.node);
      return mapToFoodCategories(saleorCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      
      // Fallback to default food categories
      return [
        { id: 'drinks', name: 'Beverages', icon: '🥤', description: 'Fresh juices and drinks', productCount: 5 },
        { id: 'groceries', name: 'Groceries', icon: '🛒', description: 'Essential food items', productCount: 8 },
        { id: 'pizza', name: 'Pizza', icon: '🍕', description: 'Fresh pizza and Italian cuisine', productCount: 12 },
        { id: 'burgers', name: 'Burgers', icon: '🍔', description: 'Juicy burgers and American food', productCount: 8 },
        { id: 'asian', name: 'Asian', icon: '🍜', description: 'Asian cuisine and specialties', productCount: 15 },
        { id: 'healthy', name: 'Healthy', icon: '🥗', description: 'Fresh salads and healthy options', productCount: 10 },
        { id: 'desserts', name: 'Desserts', icon: '🍰', description: 'Sweet treats and desserts', productCount: 6 },
        { id: 'snacks', name: 'Snacks', icon: '🍿', description: 'Light bites and snacks', productCount: 4 }
      ];
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { setSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
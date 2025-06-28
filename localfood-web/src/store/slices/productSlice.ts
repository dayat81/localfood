import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../services/apollo';
import { gql } from '@apollo/client';

export interface Product {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    priceRange?: {
      start?: {
        gross?: {
          amount: number;
          currency: string;
        };
      };
    };
  };
  thumbnail?: {
    url: string;
  };
  category?: {
    id: string;
    name: string;
  };
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    total: number;
  };
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    rating?: number;
  };
  sortBy: string;
  viewMode: 'grid' | 'list';
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    total: 0,
  },
  filters: {},
  sortBy: 'name',
  viewMode: 'grid',
};

const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          description
          thumbnail {
            url
          }
          category {
            id
            name
          }
          defaultVariant {
            id
            name
            channelListings {
              price {
                amount
                currency
              }
            }
          }
        }
      }
      totalCount
    }
  }
`;

// Map Saleor products to food-themed names and better descriptions
const mapToFoodProducts = (saleorProducts: any[]): Product[] => {
  const foodNames: { [key: string]: { name: string; description: string; category: string } } = {
    'apple juice': { 
      name: 'Fresh Apple Juice', 
      description: 'Crisp and refreshing apple juice made from locally sourced apples. Perfect for breakfast or a healthy snack.',
      category: 'Beverages'
    },
    'banana juice': { 
      name: 'Tropical Banana Smoothie', 
      description: 'Creamy banana smoothie packed with natural sweetness and energy. Great post-workout drink.',
      category: 'Beverages'
    },
    'bean juice': { 
      name: 'Green Bean Juice', 
      description: 'Nutritious green bean juice loaded with vitamins and minerals. A healthy choice for wellness.',
      category: 'Beverages'
    },
    'carrot juice': { 
      name: 'Fresh Carrot Juice', 
      description: 'Vibrant orange carrot juice rich in beta-carotene and vitamin A. Great for your eyesight!',
      category: 'Beverages'
    },
    'monospace tee': { 
      name: 'Gourmet Pizza Margherita', 
      description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil on hand-tossed dough.',
      category: 'Pizza'
    },
    'blue hoodie': { 
      name: 'Classic Cheeseburger', 
      description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce on a brioche bun.',
      category: 'Burgers'
    },
    'blue plimsolls': { 
      name: 'Chicken Caesar Salad', 
      description: 'Crisp romaine lettuce with grilled chicken, parmesan cheese, and house-made Caesar dressing.',
      category: 'Salads'
    },
    'blue polygon shirt': { 
      name: 'Sushi Roll Combo', 
      description: 'Fresh sushi rolls with salmon, tuna, and avocado. Served with wasabi and pickled ginger.',
      category: 'Sushi'
    }
  };

  return saleorProducts.map((product, index) => {
    const key = product.name.toLowerCase();
    const mapping = foodNames[key];
    
    // Get price from channel listings
    const price = product.defaultVariant?.channelListings?.[0]?.price;
    const priceAmount = price?.amount || Math.floor(Math.random() * 20) + 8;
    const currency = price?.currency || 'USD';
    
    return {
      id: product.id,
      name: mapping?.name || product.name,
      description: mapping?.description || product.description || 'Delicious food item from our kitchen',
      pricing: {
        priceRange: {
          start: {
            gross: {
              amount: priceAmount,
              currency: currency,
            },
          },
        },
      },
      thumbnail: {
        url: product.thumbnail?.url || `https://picsum.photos/300/200?food=${index + 1}`,
      },
      category: {
        id: product.category?.id || 'default',
        name: mapping?.category || product.category?.name || 'Food',
      },
      isAvailable: true,
      rating: Math.random() * 1.5 + 3.5, // 3.5-5.0 range
      reviewCount: Math.floor(Math.random() * 200) + 20,
    };
  });
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: {
    page?: number;
    filters?: any;
    sortBy?: string;
  } = {}) => {
    const { page = 1, filters = {}, sortBy = 'name' } = params;
    
    try {
      const { data } = await client.query({
        query: GET_PRODUCTS,
        variables: {
          first: 20,
          channel: 'default-channel',
        },
        fetchPolicy: 'cache-first',
      });
      
      const saleorProducts = data.products.edges.map((edge: any) => edge.node);
      const mappedProducts = mapToFoodProducts(saleorProducts);
      
      return {
        products: mappedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(data.products.totalCount / 20) || 1,
          hasMore: mappedProducts.length >= 20,
          total: data.products.totalCount || mappedProducts.length,
        },
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      
      // Fallback to food-themed mock data
      const fallbackProducts: Product[] = [
        {
          id: 'pizza-1',
          name: 'Margherita Pizza',
          description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
          pricing: { priceRange: { start: { gross: { amount: 16.99, currency: 'USD' } } } },
          thumbnail: { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' },
          category: { id: 'pizza', name: 'Pizza' },
          isAvailable: true,
          rating: 4.5,
          reviewCount: 89
        },
        {
          id: 'burger-1',
          name: 'Classic Cheeseburger',
          description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce',
          pricing: { priceRange: { start: { gross: { amount: 12.99, currency: 'USD' } } } },
          thumbnail: { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' },
          category: { id: 'burgers', name: 'Burgers' },
          isAvailable: true,
          rating: 4.3,
          reviewCount: 156
        },
        {
          id: 'juice-1',
          name: 'Fresh Orange Juice',
          description: 'Freshly squeezed orange juice packed with vitamin C',
          pricing: { priceRange: { start: { gross: { amount: 4.99, currency: 'USD' } } } },
          thumbnail: { url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop' },
          category: { id: 'beverages', name: 'Beverages' },
          isAvailable: true,
          rating: 4.7,
          reviewCount: 67
        },
        {
          id: 'salad-1',
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce with parmesan cheese and Caesar dressing',
          pricing: { priceRange: { start: { gross: { amount: 9.99, currency: 'USD' } } } },
          thumbnail: { url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop' },
          category: { id: 'salads', name: 'Salads' },
          isAvailable: true,
          rating: 4.2,
          reviewCount: 43
        }
      ];
      
      return {
        products: fallbackProducts,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
          total: fallbackProducts.length,
        },
      };
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    resetPagination: (state) => {
      state.pagination.currentPage = 1;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { products, pagination } = action.payload;
        
        if (pagination.currentPage === 1) {
          state.items = products;
        } else {
          state.items = [...state.items, ...products];
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSortBy,
  setViewMode,
  resetPagination,
} = productSlice.actions;

export default productSlice.reducer;
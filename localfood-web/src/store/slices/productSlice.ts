import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: {
    page?: number;
    filters?: any;
    sortBy?: string;
  } = {}) => {
    const { page = 1, filters = {}, sortBy = 'name' } = params;
    
    // Mock implementation - in real app this would use Apollo Client
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProducts: Product[] = Array.from({ length: 12 }, (_, index) => ({
      id: `product-${page}-${index}`,
      name: `Product ${(page - 1) * 12 + index + 1}`,
      description: `Delicious product description for item ${(page - 1) * 12 + index + 1}`,
      pricing: {
        priceRange: {
          start: {
            gross: {
              amount: Math.floor(Math.random() * 50) + 10,
              currency: 'USD',
            },
          },
        },
      },
      thumbnail: {
        url: `https://picsum.photos/300/200?random=${(page - 1) * 12 + index + 1}`,
      },
      category: {
        id: `category-${index % 5}`,
        name: ['Pizza', 'Burgers', 'Sushi', 'Pasta', 'Salads'][index % 5],
      },
      isAvailable: Math.random() > 0.1,
      rating: Math.random() * 2 + 3,
      reviewCount: Math.floor(Math.random() * 100) + 1,
    }));

    return {
      products: mockProducts,
      pagination: {
        currentPage: page,
        totalPages: 5,
        hasMore: page < 5,
        total: 60,
      },
    };
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
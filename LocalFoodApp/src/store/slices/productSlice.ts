import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category } from '../../types';
import { client } from '../../services/apollo';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT_DETAILS, 
  SEARCH_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY 
} from '../../services/graphql/products';
import { GET_CATEGORIES } from '../../services/graphql/categories';
import { handleApolloError } from '../../utils/errorHandling';

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

const initialState: ProductState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  },
};

// Async thunks for product operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { 
    channel: string; 
    first?: number; 
    after?: string; 
    search?: string;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCTS,
        variables: {
          channel: params.channel,
          first: params.first || 20,
          after: params.after,
          filter: params.search ? { search: params.search } : undefined,
        },
        fetchPolicy: 'network-only',
      });

      const products = data.products.edges.map((edge: any) => edge.node);
      
      return {
        products,
        pageInfo: data.products.pageInfo,
        totalCount: data.products.totalCount,
      };
    } catch (error: any) {
      const appError = handleApolloError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CATEGORIES,
        variables: { first: 50 },
        fetchPolicy: 'network-only',
      });

      const categories = data.categories.edges.map((edge: any) => ({
        ...edge.node,
        productCount: edge.node.products.totalCount,
      }));

      return categories;
    } catch (error: any) {
      const appError = handleApolloError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (params: { productId: string; channel: string }, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_DETAILS,
        variables: {
          id: params.productId,
          channel: params.channel,
        },
        fetchPolicy: 'network-only',
      });

      return data.product;
    } catch (error: any) {
      const appError = handleApolloError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: {
    channel: string;
    search: string;
    first?: number;
    after?: string;
  }, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: SEARCH_PRODUCTS,
        variables: {
          channel: params.channel,
          search: params.search,
          first: params.first || 20,
          after: params.after,
        },
        fetchPolicy: 'network-only',
      });

      const products = data.products.edges.map((edge: any) => edge.node);
      
      return {
        products,
        pageInfo: data.products.pageInfo,
        totalCount: data.products.totalCount,
      };
    } catch (error: any) {
      const appError = handleApolloError(error);
      return rejectWithValue(appError.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.hasNextPage = action.payload.pageInfo.hasNextPage;
        state.error = null;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.hasNextPage = action.payload.pageInfo.hasNextPage;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearSelectedProduct,
  clearError,
  resetPagination,
} = productSlice.actions;

export default productSlice.reducer;
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchState {
  query: string;
  results: any[];
  suggestions: string[];
  recentSearches: string[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    priceRange?: string;
    rating?: string;
    features?: string[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: SearchState = {
  query: '',
  results: [],
  suggestions: [],
  recentSearches: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
};

// Async thunk to load recent searches from storage
export const loadRecentSearches = createAsyncThunk(
  'search/loadRecentSearches',
  async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      return searches ? JSON.parse(searches) : [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  }
);

// Async thunk to save recent searches to storage
export const saveRecentSearch = createAsyncThunk(
  'search/saveRecentSearch',
  async (query: string, { getState }) => {
    try {
      const state = getState() as { search: SearchState };
      const currentSearches = state.search.recentSearches;
      
      // Remove existing instance of this query
      const filteredSearches = currentSearches.filter(search => search !== query);
      
      // Add to beginning and limit to 10 items
      const newSearches = [query, ...filteredSearches].slice(0, 10);
      
      await AsyncStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    } catch (error) {
      console.error('Error saving recent search:', error);
      return [];
    }
  }
);

// Async thunk to clear recent searches
export const clearRecentSearches = createAsyncThunk(
  'search/clearRecentSearches',
  async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      return [];
    } catch (error) {
      console.error('Error clearing recent searches:', error);
      return [];
    }
  }
);

// Async thunk to perform search
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (searchParams: { 
    query: string; 
    page?: number;
    filters?: any;
  }, { rejectWithValue }) => {
    try {
      const { query, page = 1, filters = {} } = searchParams;
      
      // In a real app, this would make an API call
      // For now, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockResults = Array.from({ length: 10 }, (_, index) => ({
        id: `search-result-${page}-${index}`,
        name: `Search Result ${(page - 1) * 10 + index + 1} for "${query}"`,
        description: 'This is a mock search result description.',
        price: {
          amount: Math.floor(Math.random() * 50) + 10,
          currency: 'USD',
        },
        category: 'Food',
        inStock: Math.random() > 0.2,
        type: 'product' as const,
      }));

      return {
        results: mockResults,
        pagination: {
          currentPage: page,
          totalPages: 5,
          total: 50,
          hasMore: page < 5,
        },
      };
    } catch (error) {
      return rejectWithValue('Search failed. Please try again.');
    }
  }
);

// Async thunk to get search suggestions
export const getSearchSuggestions = createAsyncThunk(
  'search/getSearchSuggestions',
  async (query: string) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll return mock suggestions
      if (query.length < 2) return [];
      
      const mockSuggestions = [
        `${query} pizza`,
        `${query} burger`,
        `${query} sushi`,
        `${query} pasta`,
        `${query} chicken`,
      ].filter(suggestion => suggestion !== query);

      return mockSuggestions.slice(0, 5);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (!action.payload) {
        state.results = [];
        state.suggestions = [];
        state.pagination = initialState.pagination;
      }
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      if (value === null || value === undefined || value === '') {
        delete state.filters[key as keyof typeof state.filters];
      } else {
        state.filters = {
          ...state.filters,
          [key]: value,
        };
      }
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearResults: (state) => {
      state.results = [];
      state.suggestions = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    // Load recent searches
    builder
      .addCase(loadRecentSearches.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      });

    // Save recent search
    builder
      .addCase(saveRecentSearch.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      });

    // Clear recent searches
    builder
      .addCase(clearRecentSearches.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      });

    // Perform search
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        const { results, pagination } = action.payload;
        
        if (pagination.currentPage === 1) {
          state.results = results;
        } else {
          state.results = [...state.results, ...results];
        }
        
        state.pagination = pagination;
        state.suggestions = [];
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get search suggestions
    builder
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const {
  setQuery,
  setFilter,
  clearFilters,
  clearResults,
  clearSuggestions,
} = searchSlice.actions;

export default searchSlice.reducer;
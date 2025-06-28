import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
  };
}

const initialState: SearchState = {
  query: '',
  results: [],
  suggestions: [],
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  loading: false,
  error: null,
  filters: {},
};

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResults = Array.from({ length: 8 }, (_, index) => ({
      id: `search-result-${index}`,
      name: `${query} Result ${index + 1}`,
      description: `Search result for "${query}"`,
      type: 'product',
    }));

    return mockResults;
  }
);

export const getSearchSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (query: string) => {
    if (query.length < 2) return [];
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      `${query} pizza`,
      `${query} burger`,
      `${query} sushi`,
      `${query} delivery`,
    ];
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches = [query, ...state.recentSearches.slice(0, 9)];
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    },
    setSearchFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const {
  setQuery,
  addRecentSearch,
  clearRecentSearches,
  setSearchFilters,
  clearSearchFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
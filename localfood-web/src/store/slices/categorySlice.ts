import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockCategories: Category[] = [
      { id: '1', name: 'Pizza', icon: '🍕', productCount: 15 },
      { id: '2', name: 'Burgers', icon: '🍔', productCount: 12 },
      { id: '3', name: 'Sushi', icon: '🍣', productCount: 18 },
      { id: '4', name: 'Pasta', icon: '🍝', productCount: 10 },
      { id: '5', name: 'Salads', icon: '🥗', productCount: 8 },
      { id: '6', name: 'Desserts', icon: '🍰', productCount: 14 },
      { id: '7', name: 'Drinks', icon: '🥤', productCount: 20 },
      { id: '8', name: 'Chinese', icon: '🥡', productCount: 16 },
    ];

    return mockCategories;
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
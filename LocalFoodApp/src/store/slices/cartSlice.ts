import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  currency: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  currency: 'USD',
  isLoading: false,
  error: null,
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.variantId === newItem.variantId);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const variantId = action.payload;
      state.items = state.items.filter(item => item.variantId !== variantId);
      
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },
    
    updateQuantity: (state, action: PayloadAction<{ variantId: string; quantity: number }>) => {
      const { variantId, quantity } = action.payload;
      const item = state.items.find(item => item.variantId === variantId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.variantId !== variantId);
        } else {
          item.quantity = quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.totalAmount = totals.totalAmount;
        state.totalQuantity = totals.totalQuantity;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.error = null;
    },
    
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    
    // Load cart from persisted storage
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  setCurrency,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
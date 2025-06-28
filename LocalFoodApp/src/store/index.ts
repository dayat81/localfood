import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import locationSlice from './slices/locationSlice';
import searchSlice from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    location: locationSlice,
    search: searchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
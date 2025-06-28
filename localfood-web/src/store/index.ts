import { configureStore } from '@reduxjs/toolkit';
import productSlice from './slices/productSlice';
import searchSlice from './slices/searchSlice';
import locationSlice from './slices/locationSlice';
import categorySlice from './slices/categorySlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    products: productSlice,
    search: searchSlice,
    location: locationSlice,
    categories: categorySlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  orderHistory: Order[];
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderHistory: [],
};

// Async thunks for order operations
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // This will be implemented with actual Saleor GraphQL queries
      return [];
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // This will be implemented with actual Saleor GraphQL queries
      return null;
    } catch (error) {
      return rejectWithValue('Failed to fetch order details');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      // This will be implemented with actual Saleor checkout completion
      return null;
    } catch (error) {
      return rejectWithValue('Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // This will be implemented with actual Saleor GraphQL mutations
      return orderId;
    } catch (error) {
      return rejectWithValue('Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addOrderToHistory: (state, action: PayloadAction<Order>) => {
      state.orderHistory.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentOrder = action.payload;
          state.orders.unshift(action.payload);
          state.orderHistory.unshift(action.payload);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        state.orders = state.orders.filter(order => order.id !== orderId);
        state.orderHistory = state.orderHistory.map(order => 
          order.id === orderId 
            ? { ...order, status: 'CANCELLED' }
            : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentOrder, clearError, addOrderToHistory } = orderSlice.actions;
export default orderSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderAPI from '../../api/order';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getMyOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Order not found');
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order || action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order || action.payload;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const updated = action.payload.order || action.payload;
        state.currentOrder = updated;
        state.orders = state.orders.map((o) =>
          o._id === updated._id ? updated : o
        );
      });
  },
});

export default orderSlice.reducer;

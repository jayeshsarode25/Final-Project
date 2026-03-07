import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartAPI from '../../api/cart';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addItemToCart(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(productId, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || action.payload.cart?.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || action.payload.cart?.items || state.items;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.items = action.payload.items || action.payload.cart?.items || state.items;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

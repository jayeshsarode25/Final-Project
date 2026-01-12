import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

export const registerUser = createAsyncThunk(
  "api/auth/register",
  async (form, { rejectWithValue }) => {
    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
        role: form.userType,
      };

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      // handle express-validator errors
      if (error.response?.data?.errors) {
        return rejectWithValue(
          error.response.data.errors.map(e => e.msg).join(", ")
        );
      }

      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "api/auth/login",
  async(from,{rejectWithValue})=>{
    try {
      const payload = {
        username: from.username,
        email:from.email,
        password:from.password
      };

      const responce = await axios.post("http://localhost:3000/api/auth/login",
        payload,
        {withCredentials:true})
        return responce.data

    } catch (error) {
      if (error.response?.data?.errors) {
        return rejectWithValue(
          error.response.data.errors.map(e => e.msg).join(", ")
        );
      }

      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      )
    }
  }
)

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.message = action.payload.message; // ✅ "User created"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ string
      })
      .addCase(loginUser.pending,(state)=>{
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled,(state,action)=>{
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload
      })
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { dummyProducts } from "../../data/dummyData";



const initialState = {

}

export const fratchProducts = createAsyncThunk(
    "products/featchProducts",
    async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyProducts);
      }, 500);
    });
  }

)


const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fratchProducts.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fratchProducts.fulfilled,(state,action)=>{
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fratchProducts.rejected,(state,action)=>{
            state.loading = false;
            state.error = "Failed to fetch products";
        })
    }
})



export default productSlice.reducer;    
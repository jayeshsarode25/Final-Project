import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './reducer/userSlice'
import  productReducer  from './reducer/ProductSlice'

export const store = configureStore({
  reducer: {
    auth: userReducer,
    product: productReducer,
  },
})
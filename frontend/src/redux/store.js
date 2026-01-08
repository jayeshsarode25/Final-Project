import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './reducer/userSlice'

export const store = configureStore({
  reducer: {
    auth: userReducer,
  },
})
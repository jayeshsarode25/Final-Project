import { createSlice } from "@reduxjs/toolkit";


const intialState = {
    users : null,
}

export const userSlice = createSlice({
    name: "user",
    initialState: intialState,
    reducers:{
        loaduser: (state, action)=>{
            state.users = action.payload;
        },
        removeuser: (state, action)=>{
            state.users = null;
        }
    }
});

export const {loaduser, removeuser} = userSlice.actions
export default userSlice.reducer;
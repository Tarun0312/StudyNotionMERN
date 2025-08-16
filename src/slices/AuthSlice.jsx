import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token:localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
};

const AuthSlice = createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
        setToken:(state,action) => {
            state.token = action.payload
        }
    }
})

export const {setToken} = AuthSlice.actions;
export default AuthSlice.reducer;
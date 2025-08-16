import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    user:null
}

const ProfileSlice = createSlice({
    name:'profile',
    initialState:initialState,
    reducers:{
        setUserData : (state,action)=>{
            state.user = action.payload
        }
    }
})

export const {setUserData} = ProfileSlice.actions;
export default ProfileSlice.reducer;
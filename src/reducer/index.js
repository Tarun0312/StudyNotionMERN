import {combineReducers} from '@reduxjs/toolkit';
import authReducer from '../slices/AuthSlice';
import CartReducer from '../slices/CartSlice';
import  profileReducer from '../slices/ProfileSlice';

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:CartReducer
})

export default rootReducer;
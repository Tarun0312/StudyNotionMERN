import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-hot-toast'

const initialState = {
    totalItems:localStorage.getItem("totalItems")? JSON.parse(localStorage.getItem("totalItems")) : 0,

    coursesList:[]
}

const CartSlice = createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        setTotalItems(state,action){
           state.totalItems = action.payload
        },

        // add to cart
        addItemsToCart(state,action){
            state.coursesList.push(action.payload);
            this.setTotalItems(state,state.coursesList.length)
            toast.success("Course added to cart successfully")
        },

        // remove from cart
        removeItemsFromCart(state,action){
            state.coursesList.filter((course) => course.id!== action.payload)
            this.setTotalItems(state,state.coursesList.length)    
            toast.remove("Course removed from cart successfully")
        },

        // reset cart
        resetCart(state,action){
            state.coursesList = []
            this.setTotalItems(state,state.coursesList.length)    
            toast.remove("Course Cart reset successfully")
        }
    }
})

export const{ setTotalItems,addItemsToCart,removeItemsFromCart,resetCart} = CartSlice.actions;
export default  CartSlice.reducer;
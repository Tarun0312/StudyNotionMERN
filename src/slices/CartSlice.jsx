import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-hot-toast'

const initialState = {
    totalItems:localStorage.getItem("totalItems")? JSON.parse(localStorage.getItem("totalItems")) : 0,

}

const CartSlice = createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{

        // add to cart
        addItemsToCart(state,action){
            state.coursesList.push(action.payload);
            toast.success("Course added to cart successfully")
        },

        // remove from cart
        removeItemsFromCart(state,action){
            state.coursesList?.filter((course) => course.id!== action.payload)
            toast.remove("Course removed from cart successfully")
        },

        // reset cart
        resetCart(state){
            state.coursesList = []
            toast.remove("Course Cart reset successfully")
        }
    }
})

export const{ setTotalItems,addItemsToCart,removeItemsFromCart,resetCart} = CartSlice.actions;
export default  CartSlice.reducer;
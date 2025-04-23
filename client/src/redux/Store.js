import {configureStore} from '@reduxjs/toolkit'
import userReducer from "./UserSlice"
import blogReducer from "./BlogSlice"
export const store = configureStore({
    reducer:{
        user : userReducer,
        blogs : blogReducer,
    }
})

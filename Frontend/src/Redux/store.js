import {configureStore } from '@reduxjs/toolkit';
import  chatSlice  from './chatSlice';
import messageSlice from './messageSlice';

export const store = configureStore({
    reducer:{
        chat : chatSlice,
        message : messageSlice
    }
});
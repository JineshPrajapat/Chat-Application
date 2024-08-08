import {createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

const messageSlice = createSlice({
    name: 'message',
    initialState:{
        messages:[],
    },
    reducers: {
        setMessages : (state, action) =>{
            state.messages = action.payload;
        },
        addMessage : (state, action) =>{
            const date = moment(action.payload.createdAt).format('YYYY-MM-DD');
            if(!state.messages[date]){
                state.messages[date]=[];
            }
            state.messages[date].push(action.payload);
        }
    }
});

export const  {setMessages, addMessage} = messageSlice.actions;
export default messageSlice.reducer;

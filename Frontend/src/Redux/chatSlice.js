import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name : 'chat',
    initialState : {
        conversation: [],
        onlineUser: [],
        allUser : [],
        currentChat:{
            currentUserID:"",
            fullName:"",
            profileImage:"",
            email:"",
            online:false
        }
    },

    reducers:{
        setAllUser : (state, action )=>{
            state.allUser = action.payload;
        },
        setConversation: (state, action)=>{
            state.conversation = action.payload;
        },
        converstionRecieved :(state, action)=>{
            state.conversation.push(action.payload);
          },
        setCurrentChat : (state, action )=>{
            state.currentChat.currentUserID = action.payload?._id;
            state.currentChat.username = action.payload?.username;
            state.currentChat.fullName = action.payload?.fullName;
            state.currentChat.profileImage = action.payload?.profileImage;
            state.currentChat.email = action.payload?.email
            state.currentChat.online = action.payload?.online
        }
    }
});

export const {setConversation, setCurrentChat, converstionRecieved, setAllUser} = chatSlice.actions;
export default chatSlice.reducer;
import io from "socket.io-client";
import { store } from "../Redux/store";
import { setConversation, setAllUser, setCurrentChat } from "../Redux/chatSlice";
import { setMessages } from "../Redux/messageSlice";
import { chatURL } from "../API/api";


let socket = null;
export const connectWithSocketServer = () => {
    socket = io(chatURL, {
        auth: {
            token: localStorage.getItem('token'),
        },
        reconnectionAttempts: 5
    });

    socket.on("connect", () => {
        console.log("connnected with socket server");
        // console.log(socket.id);
    });

    socket.on("conversation", (data) => {
        // console.log("conversation data",data)
        store.dispatch(setConversation(data));
    });

    socket.on("all-user", (data) => {
        // console.log("all user data", data);
        store.dispatch(setAllUser(data));
    });

    socket.on("current-user-detail", (data) => {
        // console.log("current-user-detail", data);
        store.dispatch(setCurrentChat(data));
    });

    socket.on("message", (data) => {
        if (data) {
            // console.log('Message data:', data);
            store.dispatch(setMessages(data));
        } else {
            console.error('No data received in message event');
        }
    });

};

// below function are called in other component within the siderbar, chatbox, input etc as per required;
// from frontend what ever opration have to perform then all data is transmit from this page consit of operations



export const getCurrentUser = (data) => {
    try {
        if (data) {
            store.dispatch(setMessages([]));

            // Check if socket is available
            if (socket && typeof socket.emit === 'function') {
                socket.emit("message-page", data);
            } else {
                console.log("Socket is not available or does not have an emit method.");
            }
        } else {
            console.log("No data provided.");
        }
    }
    catch (err) {
        console.log(err);
    }
}

export const sendDirectMessage = (data) => {
    console.log("sendDirectMessage", data);
    try {
        if (data) {
            // Check if socket is available
            if (socket && typeof socket.emit === 'function') {
                socket.emit("direct-message", data);
            } else {
                console.log("Socket is not available or does not have an emit method.");
            }
        } else {
            console.log("No data provided.");
        }
    }
    catch (err) {
        console.log(err);
    }
}

export const directChatHistory = (data) => {
    try {
        // Check if socket is available
        if (socket && typeof socket.emit === 'function') {
            store.dispatch(setMessages([]));
            socket.emit("direct-chat-history", data);
        } else {
            console.log("Socket is not available or does not have an emit method.");
        }
    } catch (err) {
        console.error(err);
    }
}

export const deleteMessage = (data) =>{
    try{
        if(data){
            console.log(data);
            socket.emit("delete-messages", data)
        }
    }catch(err){
        console.log("retry", err);
    }
}

export const updateSeen =(data) =>{
    try{
        if(data){
            socket.emit("seen", data);
        }
    }catch(err){
        console.log(err);
    }
}

export const updateMessage = (data)=>{
    try{
        if(data){
            console.log("update Message", data);
            socket.emit("update-message", data);
        }
    }
    catch(err){
        console.log(err);
    }
}
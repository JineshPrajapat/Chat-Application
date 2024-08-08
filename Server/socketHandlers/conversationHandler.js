const Conversation  = require("../models/Conversation");
const serverStore = require("../serverStore");
const getConversation = require("./utils/getConversation");

let io =null;
const conversationHandler = async(socket)=>{
    try{
        
        console.log("conversationHandler");
        const userID = socket.user.id;

        const  conversationSender = await getConversation(userID);

        if(conversationSender)
        {
            io = serverStore.getSocketServerIntstance();
            // console.log("conversationSender", conversationSender);
            io.to(socket.id).emit('conversation', conversationSender);
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = conversationHandler;
const Conversation = require("../models/Conversation");
const serverStore = require("../serverStore");

let io =null;

const directChatHistoryHandler =async (socket, data)=>{
    try{
        const userID = socket.user.id;
        const receiverID = data;

        console.log("receiverID", receiverID, userID);

        const getConversationMessage = await Conversation.findOne({
            "$or":[
                { sender: userID, receiver: receiverID },
                { sender: receiverID, receiver: userID }
            ]
        }).populate('messages').sort({updatedAt :-1});

        const groupedMessages = getConversationMessage?.messages?.reduce((acc, message)=>{
            const date = message.createdAt.toISOString().split('T')[0];
            if(!acc[date]){
                acc[date]=[];
            }

            acc[date].push(message);
            return acc;
        }, {});
        

        // console.log("grouped Messages", groupedMessages);

        io = serverStore.getSocketServerIntstance();
        if(groupedMessages)
        {
            io.to(socket.id).emit("message", groupedMessages || []);
            io.to(socket.id).emit("direct-chat-history", getConversationMessage);
        }

    }
    catch(err)
    {
        console.log("directChatHistoryHandler", err);
    }
};

module.exports = directChatHistoryHandler;

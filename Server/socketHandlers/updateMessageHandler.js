const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const directChatHistoryHandler = require("./directChatHistoryHandler");

const updateMessageHandler = async (socket, data)=>{
    console.log("updateMessageHandler", data);

    const userID = socket.user.id;
    const receiverID = data?.receiverID;
    const messageID = data?.messageID;

    try{
        await Message.findByIdAndUpdate(
            messageID,
            {text: data?.text, seen : false},
            {new:true}
        );

        directChatHistoryHandler(socket, receiverID);

    }
    catch(err){
        console.log(err);
    }
}

module.exports = updateMessageHandler;
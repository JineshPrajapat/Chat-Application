const Conversation = require("../models/Message");
const Message = require("../models/Message");

const directChatHistoryHandler = require("./directChatHistoryHandler");

const deleteMessageHandler = async (socket, data) => {
    console.log("deleteMessageHandler");

    const userID = socket.user.id;
    const receiverID = data?.currentChat;

    try {
        await Message.deleteMany({ _id: { $in: data.selectedMessages } });

        await Conversation.updateOne({
            "$or": [
                { sender: userID, receiver: receiverID },
                { sender: receiverID, receiver: userID }
            ]
        },
            { $pull : {messages : {$in : data?.selectedMessages}}}
        )
    }
    catch(error){
        console.error("Error in deleting messages", error);
    }
    finally{
        directChatHistoryHandler(socket, receiverID);
    }
};

module.exports = deleteMessageHandler;

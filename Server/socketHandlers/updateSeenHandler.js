const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const serverStore=  require("../serverStore");
const getConversation = require("../socketHandlers/utils/getConversation");

let io =null;

const updateSeenHandler = async (socket, data)=>{
   try{
    const senderID = socket.user.id;
    let msgByUserId = data;

    let conversation = await Conversation.findOne({
        "$or":[
            { sender: senderID, receiver: msgByUserId },
            { sender: msgByUserId, receiver: senderID }
        ]
    });

    const conversationMessageID = conversation?.messages || [];

    const updatedMessage = await Message.updateMany(
        {_id :{ "$in": conversationMessageID}, msgByUserId: msgByUserId},
        { "$set": {seen: true} }
    );

    const conversationSender = await getConversation(senderID);
        if (conversationSender) {
            io = serverStore.getSocketServerIntstance();
            io.to(socket.id).emit('conversation', conversationSender);
        }
   }
   catch(err)
   {
    console.log(err);
   }

};

module.exports = updateSeenHandler;

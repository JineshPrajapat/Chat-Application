const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const serverStore = require("../serverStore");
const getConversation = require("./utils/getConversation");

const getReceiverSocketID = require("./utils/getReceiverSocketID");

let io = null;

const directMessageHandler = async (socket, data) => {
    try {
        console.log("direct message event is being handled");
        console.log("message:", data);

        const senderID = socket.user.id;
        const receiverID = data?.receiver;

        let conversation = await Conversation.findOne({
            "$or": [
                { sender: senderID, receiver: receiverID },
                { sender: receiverID, receiver: senderID }
            ]
        });

        if (!conversation) {
            // new conversation created
            const createConversation = await Conversation({
                sender: senderID,
                receiver: receiverID
            });

            conversation = await createConversation.save();
        }

        // new message created
        const message = new Message({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: senderID
        });

        const savedMessage = await message.save();

        // pushing messageID to messsage array key conversation model
        const updatedConversation = await Conversation.updateOne({ _id: conversation?._id }, {
            "$push": { messages: savedMessage?._id }
        });

        const getConversationMessage = await Conversation.findOne({
            "$or": [
                { sender: senderID, receiver: receiverID },
                { sender: receiverID, receiver: senderID }
            ]
        }).populate("messages").sort({ updatedAt: -1 });

        const groupedMessages = getConversationMessage?.messages?.reduce((acc, message) => {
            const date = message.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push(message);
            return acc;
        }, {});

        // console.log("groupedMessages", groupedMessages);

        const receiverSocketID = getReceiverSocketID(receiverID);

        if (getConversationMessage) {
            io = serverStore.getSocketServerIntstance();

            // sending message to both sender and reciever in message Box
            console.log("ReciverSocketID ::|::||::|::", receiverSocketID);
            io.to(socket.id).emit("message", groupedMessages || []);
            io.to(receiverSocketID).emit("message", groupedMessages || []);
        }

        const conversationSender = await getConversation(senderID);
        const conversationReceiver = await getConversation(data?.receiver);

        if (conversationSender) {
            io = serverStore.getSocketServerIntstance();
            io.to(socket.id).emit('conversation', conversationSender);
            // io.to(socket.id).emit('conversation', conversationReceiver);
        }

        if (receiverSocketID) {
            console.log("receiverSocketID::::>>::>>", receiverSocketID)
            io = serverStore.getSocketServerIntstance();
            io.to(receiverSocketID).emit('conversation', conversationReceiver);
        }
    }
    catch (err) {
        console.log("directMesssageHandler", err);
    }
};

module.exports = directMessageHandler;
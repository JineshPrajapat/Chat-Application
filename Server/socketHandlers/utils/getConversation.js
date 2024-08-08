const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const serverStore = require("../../serverStore")

const getConversation = async (currentUserId) => {
    if (currentUserId) {
        const currentUserConversation = await Conversation.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver').select("-password")

        let onlineUsers = serverStore.getOnlineUsers();

        const conversation = currentUserConversation.map((conv) => {
            const opponentReciever = conv?.sender?._id.toString() !== currentUserId ? conv?.sender : conv?.receiver;
            const isSenderOnline = onlineUsers.some(onlineUser => onlineUser.userId.userId === conv.sender._id.toString() && conv.sender._id.toString() !== currentUserId);
            const isReceiverOnline = onlineUsers.some(onlineUser =>onlineUser.userId.userId === conv.receiver._id.toString() && conv.receiver?._id.toString() !== currentUserId);

            const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if (msgByUserId !== currentUserId) {
                    return preve + (curr?.seen ? 0 : 1)
                } else {
                    return preve
                }

            }, 0)

            return {
                _id: conv?._id,
                // sender: conv?.sender,
                // receiver: conv?.receiver,
                opponent : opponentReciever,
                unseenMsg: countUnseenMsg,
                online: isSenderOnline || isReceiverOnline,
                lastMsg: conv.messages[conv?.messages?.length - 1]
            }
        })

        return conversation;
    } else {
        return []
    }
}

module.exports = getConversation;
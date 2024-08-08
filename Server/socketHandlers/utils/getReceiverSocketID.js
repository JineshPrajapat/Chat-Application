const serverStore = require("../../serverStore");

const getReceiverSocketID = (receiverID) =>{
    let onlineUsers = serverStore.getOnlineUsers();
    // console.log("onlineUsers", onlineUsers);
    for(let user of onlineUsers){
        if(user?.userId?.userId === receiverID){
            console.log("key of receievr", user?.socketId);
            return user?.socketId;
        }
    }
    return null;
};

module.exports = getReceiverSocketID;
let io = null;
let connectedUsers = new Map();

const setSocketServerInstance = (ioInstance) => {
    io = ioInstance;
};

const getSocketServerIntstance = () => {
    return io;
}

const addnewConnectedUser = ({ socketId, userId }) => {
    for (let [key, value] of connectedUsers) {
        if (value.userId === userId) {
            connectedUsers.delete(key);
        }
    }
    // Add the new entry with the latest socketId
    connectedUsers.set(socketId, { userId });
    // console.log("connectedUsers", connectedUsers);
};

const getOnlineUsers = () => {
    const onlineUsers = [];
    // console.log("connected user", connectedUsers);
    connectedUsers.forEach((value, key) => {
        onlineUsers.push({ socketId: key, userId: value })
    });
    // console.log("getonlineusers", onlineUsers);
    return onlineUsers;
};

const removeConnectedUser = (socketId) => {
    if (connectedUsers.has(socketId)) {
        connectedUsers.delete(socketId);
        // console.log("connectedUser", connectedUsers);
    }
}




module.exports = {
    setSocketServerInstance,
    getSocketServerIntstance,
    addnewConnectedUser,
    getOnlineUsers,
    removeConnectedUser
};

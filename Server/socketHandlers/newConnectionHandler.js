const serverStore = require("../serverStore");

const newConnectionHandler = (socket, io)=>{
    const userDetails = socket.user;
    const { id: userId, username, email } = socket.user || {};

    if (!userId) {
        console.error("User ID not found in socket object");
        return;
    }

    // console.log("newConnectionHandler",socket?.user?.userId);
    serverStore.addnewConnectedUser({
        socketId: socket.id,
        userId: userId
    });
};

module.exports = newConnectionHandler;
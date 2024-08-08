const serverStore = require("../serverStore");

const newConnectionHandler = (socket, io)=>{
    const userDetails = socket.user;
    console.log("newConnectionHandler",socket?.user?.userId);
    serverStore.addnewConnectedUser({
        socketId: socket.id,
        userId: socket?.user?.id
    });
};

module.exports = newConnectionHandler;
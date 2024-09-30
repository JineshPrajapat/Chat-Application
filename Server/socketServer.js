const {Server} = require("socket.io");
const serverStore = require("./serverStore");
const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const messagePageHandler = require("./socketHandlers/messagePageHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const updateSeenHandler = require("./socketHandlers/updateSeenHandler");
const deleteMessageHandler = require("./socketHandlers/deleteMessageHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const conversationHandler = require("./socketHandlers/conversationHandler");
const getAllUsers = require("./socketHandlers/utils/getAllUsers");
const updateMessageHandler = require("./socketHandlers/updateMessageHandler");
require("dotenv").config();

const allowedOrigins = [
    'http://localhost:3000',
    "https://chats-code.vercel.app",
    process.env.APP_URL
];

module.exports.initializeSocketServer = async (server) =>{
    const io = new Server(server, {
        cors:{
            origin : allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    serverStore.setSocketServerInstance(io);

    io.use((socket, next)=>{
        authSocket(socket, next);
    });

    const emitOnlineUsers=()=>{
        const onlineUsers = serverStore.getOnlineUsers();
        // console.log("online-users", onlineUsers);
        io.emit("online-users", {onlineUsers});
    }    

    io.on('connection', (socket) =>{
        console.log("user connected", socket.id);

        // newConnectionHandler(socket, io);
        if (typeof newConnectionHandler === 'function') {
            newConnectionHandler(socket, io);
        }
        emitOnlineUsers();
        getAllUsers(socket);
        conversationHandler(socket);


        socket.on("message-page", (data)=>{
            messagePageHandler(socket, data);
        });

        socket.on("direct-message", (data)=>{
            directMessageHandler(socket, data);
        });

        socket.on("direct-chat-history", (data)=>{
            directChatHistoryHandler(socket, data);
        });

        socket.on("seen", (data)=>{
            updateSeenHandler(socket,data);
        });

        socket.on("delete-messages", (data)=>{
            deleteMessageHandler(socket, data);
        });

        socket.on("update-message", (data)=>{
            updateMessageHandler(socket, data);
        })

        socket.on("disconnect", () =>{
            console.log("disconnected....");
            disconnectHandler(socket);
            emitOnlineUsers();
        });

    });

    setInterval(()=>{
        emitOnlineUsers();
    }, [1000*8]);
};
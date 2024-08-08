const User = require("../models/User");
const serverStore = require("../serverStore");

const messagePageHandler = async (socket, data)=>{
    console.log("currentUser name", data);

    const userDetails = await User.findOne({username: data});
    let onlineUsers = serverStore.getOnlineUsers();

    if(userDetails)
    {
        // status of user online/offline
        const userExist = onlineUsers.some(user=> user?.userId?.userId == userDetails?._id);
        // console.log("online array", userExist);

        const payload={
            _id: userDetails?._id,
            fullName: userDetails?.fullName,
            username : userDetails?.username,
            email: userDetails?.email,
            profileImage :userDetails?.profileImage,
            online: userExist
        };

        if(payload){
            io = serverStore.getSocketServerIntstance();
            // console.log("current User Info", payload);
            io.to(socket.id).emit("current-user-detail", payload);
        }

    }
    else{
        console.log("No user exist with this username");
    }
};

module.exports = messagePageHandler;
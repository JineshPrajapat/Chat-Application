const User = require("../../models/User");
const serverStore = require("../../serverStore");
const mongoose = require("mongoose");

let io = null;
const getAllUsers = async (socket) => {
    try {
        const userID = socket?.user?.id;

        console.log("UserId", socket?.user)
        let onlineUsers = serverStore.getOnlineUsers();

        const users = await User.aggregate([

            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(userID) }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    email: 1,
                    profileImage: 1,
                    _id: 1
                }
            },
            {
                $sort: {
                    fullName: 1
                }
            }
        ]);

        // adding online field
        const usersData= users.map(user => {
            const isOnline = onlineUsers.some( onlineUser => onlineUser.userId.userId === user._id.toString());
            return {
              ...user,
              online: isOnline
            };
          });

        if(usersData){
            io = serverStore.getSocketServerIntstance();
            // console.log("userData", usersData);
            io.emit("all-user", usersData);
        }
    }
    catch (err) {
        console.error("Error fetching users:", err);
        throw err;
    }
};
module.exports = getAllUsers;
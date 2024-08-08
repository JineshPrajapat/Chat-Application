const jwt  = require("jsonwebtoken");

const verifyTokenSocket = (socket, next)=>{
    const token = socket.handshake.auth?.token;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("auth ", decoded);
        socket.user = decoded;
    }
    catch(err)
    {
        const socketError = new Error("NOT AUTHORIZED");
        return next(socketError);
    }

    next();
};

module.exports = verifyTokenSocket;
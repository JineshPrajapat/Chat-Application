const jwt = require("jsonwebtoken");

const verifyTokenSocket = (socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log("token", token);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("auth ", decoded);
            socket.user = decoded;
            return next();
        }
        catch (err) {
            const socketError = new Error("NOT AUTHORIZED");
            return next(socketError);
        }
    }
    else{
        return next(new Error('No token provided'));
    }
};

module.exports = verifyTokenSocket;
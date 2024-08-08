const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const userRoutes = require("./routes/User");
const { initializeSocketServer } = require("./socketServer");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

database.connect();
cloudinaryConnect();

initializeSocketServer(server);

const allowedOrigins = [ 'http://localhost:3000', process.env.APP_URL ];

app.use(cors({ origin:allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/v1/user", userRoutes);

server.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
});

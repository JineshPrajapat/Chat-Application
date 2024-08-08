const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {})
    .then(() => {
        console.log("Database connected successfully.");
    })
    .catch( (err) => {
        console.log("Database Connection failed.");
        console.error(err);
        process.exit(1);
    })
};
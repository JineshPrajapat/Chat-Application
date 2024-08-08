const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imagUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    msgByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },


},{
    timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);
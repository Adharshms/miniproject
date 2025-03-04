const mongoose = require("mongoose");

const chatmodel = mongoose.Schema({
    chatName: { type: String },
    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    latestmsg:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    unreadMessageCount:{
        type:Number,
        default:0
    }
    
},
    {
        timestamps: true,
    });

const Chat = mongoose.model("Chat", chatmodel);
module.exports = Chat;
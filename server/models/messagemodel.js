const mongoose = require("mongoose");

const messagemodel = mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    sender:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false
    }
    
},
{
    timestamps:true,
});

const Message=mongoose.model("Message",messagemodel);
module.exports=Message
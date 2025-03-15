const mongoose = require("mongoose");

const usermodel = mongoose.Schema({
    name:{
        type:String,
        requireed:true
    },
    email:{
        type:String,
        requireed:true,
        unique: true
    },
    password:{
        type:String,
        requireed:true,
        minlength:8
    },
    language:{
        type:String,
        requireed:true
    },
},
{
    timestamps:true,
});

const User = mongoose.models.User || mongoose.model("User",usermodel);
module.exports=User
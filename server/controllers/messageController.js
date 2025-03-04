const router = require("express").Router();
const Message = require("./../models/messagemodel");
const Chat = require("./../models/chatmodel");
const authMiddleware=require('./../middlewares/authMiddleware');

router.post('/new-message',authMiddleware,async(req,res)=>{
    try{
        //store msg in msg collection
        const newMessage=new Message(req.body);
        const savedMessage=await newMessage.save();

        //udpate msg in lastmsg in chat collection
        const currentChat=await Chat.findOneAndUpdate({
            _id:req.body.chatId},{
            lastMessage:savedMessage._id,
            $inc:{unreadMessageCount:1}});
            res.status(201).send({
                message:"Message sent successfully",
                success:true,
                data:savedMessage
            });
        
    }catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        });
    }
});

router.get("/get-all-messages/:chatId",authMiddleware,async(req,res)=>{
    try{
        const allMessages=await Message.find({chatId:req.params.chatId}).sort({createdAt:1})
        res.send({
            message:"Messages fetched successfully",
            success:true,
            data:allMessages
        });
    }catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        });
       
    }
});
module.exports=router;
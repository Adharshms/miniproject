const router = require("express").Router();
const Chat = require("./../models/chatmodel");
const authMiddleware=require('./../middlewares/authMiddleware');

router.post('/create-new-chat',authMiddleware,async(req,res)=>{
    try{
        const chat=new Chat(req.body);
        const savedChat=await chat.save();
        res.status(201).send({
            message:"Chat created successfully",
            success:true,
            data:savedChat
        });
    }catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        });
    }
});
router.get('/get-chat-of-user', authMiddleware, async (req, res) => {
    try {
        console.log("🔹 User Info from Middleware:", req.user); // Debugging log

        if (!req.user || !req.user.userId) {
            console.log("❌ Unidentified User: req.user is", req.user);
            return res.status(400).send({ message: "Unidentified User", success: false });
        }

        const userId = req.user.userId;
        console.log("✅ Fetching chats for user:", userId);

        const allChats = await Chat.find({ members: { $in: [userId] } })
            .populate('members', 'name email');

        console.log("✅ Chats found:", allChats);
        res.status(200).send({
            message: "Chats fetched successfully",
            success: true,
            data: allChats,
        });
    } catch (error) {
        console.error("❌ Error fetching chats:", error.message);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
        });
    }
});



  
  
  
module.exports=router;
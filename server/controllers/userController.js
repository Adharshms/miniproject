const router = require("express").Router();
const User = require("./../models/usermodel");
const authMiddleware=require('./../middlewares/authMiddleware');


router.get('/get-logged-user',authMiddleware,async(req,res)=>{
    try{
        const user=await User.findOne({_id:req.body.userId});
        res.send({
            message:"User fetched succesfully",
            success:true,
            data:user
        });
    }catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        });
    }
  

});



router.get('/get-all-user',authMiddleware,async(req,res)=>{
    try{
        const allusers=await User.find({_id:{$ne:req.body.userId}});
        res.send({
            message:"All User fetched succesfully",
            success:true,
            data:allusers
        });
    }catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        })
    }

});


module.exports=router;
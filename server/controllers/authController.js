const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const User = require("./../models/usermodel");

router.post("/signup", async (req, res) => {
  try {
    // 1. Check if user already exists
    const existuser = await User.findOne({ email: req.body.email }); 

    // 2. If user exists, return error
    if (existuser) {
      return res.send({
        message: "User already exists",
        success: false,
      });
    }

    // 3. Encrypt password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // 4. Create new user and save to DB
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      message: "User created successfully",
      success: true,
    });

  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// router.post("/login",async (req,res)=>{
//   try{
//     //1. check is user exists
//     const existuser=await User.findOne({email:req.body.email});
//     if(!existuser){
//      return res.send({
//         message:"User do not exist",
//         success:false
//       });
//     }
//     //2.if user exist check for password
    
//      const isValid= await bcrypt.compare(req.body.password,existuser.password);
//     if(!isValid){
//       return res.status(400).send({
//         message:"Invalid password",
//         success:false
//       });
//     }
//     //3.if the user exits and password is correct send a JSON token
    
//     const token=jwt.sign({userId:existuser._id},process.env.SECRET_KEY,{expiresIn:"1d"});
//     res.status(201).send({
//       message:"User logged in successfuly",
//       success:true,
//       token:token
//     });

//   }catch(error){
//     res.send({
//       message:error.message,
//       success:false
//     });
//   }
// });
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Incoming Request Body:", req.body);  // ✅ Log the request

    // 1. Check if user exists
    const existuser = await User.findOne({ email: req.body.email });

    if (!existuser) {
      return res.send({
        message: "User does not exist",
        success: false
      });
    }

    console.log("🔹 Found User:", existuser);  // ✅ Log user details
    console.log("🔹 Incoming Password:", req.body.password);  // ✅ Check request password
    console.log("🔹 Stored Hashed Password:", existuser.password);  // ✅ Check saved password

    // 2. Check if password is provided and exists
    if (!req.body.password || !existuser.password) {
      return res.status(400).send({
        message: "Password missing or incorrect",
        success: false
      });
    }

    // 3. Validate Password
    const isValid = await bcrypt.compare(req.body.password, existuser.password);

    console.log("🔹 Password Match Result:", isValid);  // ✅ Log comparison result

    if (!isValid) {
      return res.status(400).send({
        message: "Invalid password",
        success: false
      });
    }

    // 4. Generate Token
    const token = jwt.sign({ userId: existuser._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.status(201).send({
      message: "User logged in successfully",
      success: true,
      token: token
    });

  } catch (error) {
    console.error("❌ Error:", error.message);  // ✅ Log error
    res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

module.exports = router;


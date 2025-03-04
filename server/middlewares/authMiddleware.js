// const jwt=require("jsonwebtoken");
// require("dotenv").config();

// module.exports=(req,res,next)=>{
//     try{
//         const token=req.headers.authorization.split(" ")[1];

//         const decodedToken=jwt.verify(token,process.env.SECRET_KEY);

//         req.body.userId=decodedToken.userId;
//         next();
//     }catch(error){
//         res.send({
//             message:error.message,
//             success:false
//         })
//     }
// }
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log("🔹 Incoming Auth Header:", req.headers.authorization); // Debugging log

    if (!req.headers.authorization) {
      console.log("❌ No token found in headers!");
      return res.status(401).send({ success: false, message: "Access Denied: No Token Provided" });
    }

    const token = req.headers.authorization.split(" ")[1]; // Extract token after 'Bearer'
    
    if (!token) {
      console.log("❌ Token extraction failed!");
      return res.status(401).send({ success: false, message: "Invalid Token" });
    }

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    console.log("✅ Token Verified, User ID:", verified.userId); // Debugging log

    req.user = { userId: verified.userId }; // Attach user info to request
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    res.status(401).send({ success: false, message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;

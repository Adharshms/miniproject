
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {

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
    

    req.user = { userId: verified.userId }; // Attach user info to request
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    res.status(401).send({ success: false, message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;

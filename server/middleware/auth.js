
// middleware to protect routes
import  jwt from "jsonwebtoken"
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const ProtectRoute = async (req, res, next) =>{
    try {
        const token = req.headers.token;
         if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

       const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.userId;
 
        const user = await User.findById(decoded.userId).select("-password")

        if(!user) res.json({success : false , message:"user not found"});
    req.user = user;

    next();
       
    } catch (error) {
        console.log(error.message)
        res.json({success:true , message : error.message})
    }
}
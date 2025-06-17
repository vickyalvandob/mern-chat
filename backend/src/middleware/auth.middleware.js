import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, resizeBy, next) => {
  try{
    const token = req.cookies.jwt
    
    if(!token){
      return resizeBy.status(401).json({message: "Unauthorized - No Token Provided"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(!decoded){
      return resizeBy.status(401).json({message: "Unauthorized - Invalid token!"})
    }

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
       return resizeBy.status(404).json({message: "User not found"})
    }

    req.user = user

    next()

  }catch(error){
    console.error("Error in protectRoute middleware", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}
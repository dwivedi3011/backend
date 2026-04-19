import { ApiError } from "../utils/ApiError";
import {asyncHanddler} from "../utils/asynchandler";  // {} this is used because default is there in the export 
import jwt from "jsonwebtoken";
import {User} from "..models/user.models.js"
export const verifyJWT=asyncHanddler(async(req,resizeBy,next)=>{
   try {
    const token= req.cookies?.accessToken|| req.headers("Authorization")?.replace("Bearer ","")
     if(!token){
         throw new ApiError(401,"unauthorised request")
     }
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user){
         throw new ApiError(400,"Invalid Access token")
     }
     req.user=user;
     next()  
   } catch (error) {
    throw new ApiError(401,error?.message||"invalid access token")
   }
})
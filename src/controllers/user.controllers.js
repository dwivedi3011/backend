import asyncHandler from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessAndRefereshTokens=async(userId) =>{
  try {
    const user=User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    // refresh token ko database mein save krna hai toh 
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave :false})
    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"something went wrong while generating Access and refresh token ")
  }
}
// this is basically the controller
const registerUser = asyncHandler(async (req, res) => {
   // if we want to do register user then what we need 
// need data from the frontend , 
// validation -- everything is correct , nothing is invalid
// check is user is unique : kese, username , email 
// check for avtar
// is available then upload them to cloudinary
// create user object   - from the db
// remove password and the refresh token field from response
// check for the user creation 
console.log("Register API hit");
  // this is the data from the frontend 
    const { fullName, email, userName, password } = req.body;

    
// this is the validation part
    if (!fullName || !email || !userName || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}   
// this is for the unique user
  const existedUser=await User.findOne({
    $or:[{userName},{email}]
  })

  if(!existedUser){
    throw new ApiError(409,"User is already existed")
  }
  // this is for the avtar or cover image part
  const avatarLocalPath=req.files?.avatar?.[0]?.path;
  const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
  // check avtar is uploaded or not 
  if(!avatarLocalPath){
    throw new ApiError(409,"Avatar required");
  }
  // upload this to cloudinary
  const avatar= await uploadOnCloudinary(avatarLocalPath)
  const coverImage= await uploadOnCloudinary(coverImageLocalPath)
  // check for the avtar
  if (!avatar) {
     throw new ApiError(409,"Avatar required");
  } 
  // for the data base entry
  // create the user and upload to the db
   const user =await  User.create({
        fullName,
        email,userName, password ,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""   
    })
    // remove password
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
      throw new ApiError(500,"Server error, while regestering the user ")
    }
    return res.status(201).json(
      new ApiResponse(200,createdUser,"User registered Successfully")
    )
})
const loginUser=asyncHandle(async (req,res) => {
  const{userName,email,password}=req.body;
  if(!userName ||!email){
    throw new ApiError(400,"username or password reqiuered")
    
  }
  const existedUser=await User.findOne({
    $or:[{email},{userName}]
  });
  if(!existedUser){
    throw new ApiError(400,"User doesnt  exists")
  }
  const isPasswordValid= await user.ispasswordCorrect(password)
  if(!passowrd){
    throw new ApiError(400,"Invalid user credentials")
  }
 const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)
 const loggedUser=User.findById(user._id).select("-password,-refreshToken")
 const options= {
  httpOnly:true,
  secure:true
 }
 return res.
 status(200).
 cookie("accessToken",accessToken,options).
 cookie("refreshToken",refreshToken).
 json(
  new ApiResponse(200,{
    user:loggedUser,accessToken,refreshToken
  },
  "user logged in successfully"
)
 )
})
const logoutUser=asyncHandler(async(req,res)=>{
  User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshToken: undefined
    }
  },
  {
  new: true
  }
)
 const options= {
  httpOnly:true,
  secure:true
 }
 return res.status(200).
 clearCookie("accessToeken",options).
 clearCookie("refreshToeken",options).
 json(new ApiResponse(200,{},"User logged out successfully"))
})

export { registerUser,
        loginUser,
        logoutUser
};

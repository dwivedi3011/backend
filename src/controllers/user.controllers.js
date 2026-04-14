import asyncHandler from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

  // this is the data from the frontend 
    const { fullName, email, userName, password } = req.body;

    
// this is the validation part
    if (!fullName || !email || !userName || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}   
// this is for the unique user
  const existedUser=User.find({
    $or:[{userName},{email}]
  })

  if(existedUser){
    throw new ApiError(409,"User is already existed")
  }
  // this is for the avtar or cover image part
  const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path
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
    console.log("email:", email);
    console.log("userName:",userName);
})

export { registerUser};



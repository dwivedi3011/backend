
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

 const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        index:true     // use for the email based search 

    }
    ,
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
        index:true     // use for the email based search 

    },
    avatar:{
        type: String,
        required:true,

    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required "]
    },
    refreshToken:{
        type:String
    }
  
 },
   {
        timestamps:true
    }
)
// this will run before saving the user to the database
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10)
    next()
})
// userschema ke andr bhut saare methods add kar skte hai .... abhi hum use krnge ki password sahi hai ki nhhi  
userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){ 
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            fullName:this.fullName,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }
userSchema.methods.generateRefreshToken=function(){ 
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn: process.env.REFERSH_TOKEN_EXPIRY
        }
    )
 }
 export const user= mongoose.model("User",userSchema);
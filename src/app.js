import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
})
)
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded())  // if any space comes in betwween 
app.use(express.static("public"))
app.use(cookieParser())

// import routes
import userRoutes from "./routes/user.router.js"
// phle app.get ka use kr rhe the lekin ab routes aur controller alag alag jagah hai toh syntax mein thooda diff aayega uski jagah  app.use hoga 

app.use("/api/v1/users",userRoutes) 


 // kounsa router activate karana hai
// http://localhost:8000/api/v1/users/register
export default app;
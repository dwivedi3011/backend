import { Router } from "express";
import { registerUser,loginUser, logoutUser } from "../controllers/user.controllers.js";
import {upload} from "../middleware/multer.js"

const router = Router()
// ab yha routeer kese likhte hai woh pta lagega 
router.route("/register").post(
    upload.fields([
    {name:"avatar",maxCount:1},  // this is how we inject the middleware
    {name:"coverImage",maxCount:1}
]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
export  default router;
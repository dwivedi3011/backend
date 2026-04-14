import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middleware/multer.js"

const router = Router()
// ab yha routeer kese likhte hai woh pta lagega 
router.route("/register").post(
    upload.fields([
    {name:"Avatar",maxCount:1},  // this is how we inject the middleware
    {name:"CoverImage",maxCount:1}
]),
    registerUser)
export  default router;
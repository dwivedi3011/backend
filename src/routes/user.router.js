import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
const router = Router()
// ab yha routeer kese likhte hai woh pta lagega 
router.route("/register").post(registerUser)
export  default router
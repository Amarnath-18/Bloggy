import express from "express";
import { getUserProfile, loginUser , logoutUser, registerUser } from "../controllers/authController.js";
const router = express.Router();


router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout" , logoutUser);
router.get("/userProfile/:id" , getUserProfile)

export default router;
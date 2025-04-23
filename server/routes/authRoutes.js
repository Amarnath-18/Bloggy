import express from "express";
import { changePassword, getUserProfile, loginUser, logoutUser, registerUser, updateProfile } from "../controllers/authController.js";
import {protectRoute} from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, (req, res) => {
  res.json({ user: req.user });
});
router.get("/userProfile/:id", getUserProfile);
router.put("/changePassword", protectRoute, changePassword);
router.put("/userUpdate", protectRoute, updateProfile);

export default router;

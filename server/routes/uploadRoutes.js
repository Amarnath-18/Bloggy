import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import {  updateBlogImage, updateProfilePic } from "../controllers/uploadController.js";
const router = express.Router();

router.put("/profilePic" , protectRoute , updateProfilePic);
router.put("/blogImage"  , protectRoute , updateBlogImage);

export default router;
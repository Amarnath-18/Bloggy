import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { saveBlogImage, saveProfilePic } from "../controllers/uploadController.js";
const router = express.Router();

router.put("/profilePic" , protectRoute , saveProfilePic);
router.put("/blogImage"  , protectRoute , saveBlogImage);

export default router;
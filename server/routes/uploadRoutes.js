import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { updateProfilePic } from "../controllers/uploadController.js";
const router = express.Router();

router.put("/profilePic" , protectRoute , updateProfilePic);

export default router;
import express from "express"
import { createBlog } from "../controllers/blogController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/" , protectRoute , createBlog );

export default router;
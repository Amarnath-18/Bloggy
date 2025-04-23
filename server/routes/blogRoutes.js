import express from "express"
import { addCommentsInBlog, createBlog, deleteBlog, deleteCommentFromBlog, editCommentInBlog, getAllBlogs, getBlogByUser, getSingleBlog, toggleLikeBlog, updateBlog } from "../controllers/blogController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import Blog from "../models/Blog.js";

const router = express.Router();

router.post("/" , protectRoute , createBlog );
router.get("/" , getAllBlogs);
router.get("/:id" , getSingleBlog);
router.put("/:id" , protectRoute , updateBlog)
router.delete("/:id" , protectRoute , deleteBlog);
router.put("/like/:id" , protectRoute , toggleLikeBlog);
router.post("/comment/:id/" , protectRoute , addCommentsInBlog);
router.delete("/:blogId/comment/:commentId", protectRoute, deleteCommentFromBlog);
router.put("/:blogId/comment/:commentId", protectRoute, editCommentInBlog);
router.get("/users/:userId" , getBlogByUser);
router.get("/category/:category", getAllBlogs);

export default router;
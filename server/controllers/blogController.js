import { validateBlog } from '../helpers/validator.js';
import Blog from '../models/Blog.js';

export const createBlog = async (req, res) => {
    const { title, content, image, category } = req.body;
    try {
      validateBlog(req);
  
      const blog = new Blog({
        title,
        content,
        image,
        category,
        author: req.user._id,
      });
  
      await blog.save();
  
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message || "Blog creation failed",
      });
    }
  };
  
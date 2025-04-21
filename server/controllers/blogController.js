import { validateBlog } from "../helpers/validator.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

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

export const getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: error.message,
      message: "failed to fetch blogs",
    });
  }
};

export const getSingleBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    if (!blogId) {
      res.status(400).json({
        success: false,
        message: "blogId is undefined",
      });
    }

    const blog = await Blog.findById(blogId).populate(
      "author",
      "firstName lastName email"
    );

    if (!blog) {
      res.status(400).json({
        success: false,
        message: "blog is not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "blog fetch successfull",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "failed to get singleBlog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(402).json({
        success: false,
        message: "blog not found",
      });
    }
    console.log(blog.author, userId);
    if (blog.author.toString() !== userId.toString()) {
      return res.status(404).json({
        success: false,
        message: "User is not owner of this blog",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: title,
        content: content,
        image: image,
        category: category,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog Updated Succesfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "failed to update the blog",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog is not found",
      });
    }

    if (userId.toString() !== blog.author.toString()) {
      return res.status(403).json({
        success: false,
        message: "User does not have access not delete this blog",
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfull",
      data: deletedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Blog deletion failed",
    });
  }
};

export const toggleLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog does not exists",
      });
    }

    let message = ""; // 🔧 Declare here

    const index = blog.likes.indexOf(userId);

    if (index > -1) {
      // Already liked → unlike
      blog.likes.splice(index, 1);
      message = "Blog unliked";
    } else {
      // Not liked → like
      blog.likes.push(userId);
      message = "Blog liked";
    }

    await blog.save();
    res
      .status(200)
      .json({ success: true, message, likesCount: blog.likes.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "failed to like the blog",
    });
  }
};

export const addCommentsInBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog does not exists",
      });
    }

    const comment = {
      user: userId,
      text,
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error,
      message: "failed to add comments in blog",
    });
  }
};

export const deleteCommentFromBlog = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    console.log(comment);

    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete comment",
    });
  }
};

export const editCommentInBlog = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    comment.text = text;
    await blog.save();
    res.status(200).json({
      success: true,
      message: "Comment edited successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "failed to edit comment in blog",
    });
  }
};

export const getBlogByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(userId);
      
      const isValidUser = await User.findById(userId);
      if (!isValidUser) {
        return res.status(404).json({
          success: false,
          message: "User id not Valid",
        });
      }
  
      const blogByUser = await Blog.find({
        author: userId,
      }).populate("author", "firstName lastName").sort({createdAt:-1});
  
      if (blogByUser.length==0) {
        return res.status(404).json({
          success: false,
          message: "blogs not found by this user",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "blog fetched successfully",
        data: blogByUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "failed to fetched blogsByUser",
      });
    }
};

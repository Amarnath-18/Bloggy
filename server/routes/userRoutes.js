import Blog from "../models/Blog";
import User from "../models/User";


export const blogByUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
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
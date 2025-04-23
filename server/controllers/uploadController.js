import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const updateProfilePic = async(req , res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic) {
            return res.status(404).json({
                success:false,
                message:"profile picture url is not found"
            })
        }

        const user = await User.findById(userId);
        user.profilePic = profilePic;
        await user.save();

        return res.status(200).json({
            success:true,
            message: "profile picture saved successfully"
        })
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"failed to save profilePic"
        })
    }
}

export const updateBlogImage = async(req , res)=>{
    try {
        const {blogImage , blogId} = req.body;
        if(!blogId || !blogImage) return res.status(400).json({
            success:false,
            message:"Blog image or id is null"
        })

        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(402).json({
                success:false,
                message:"Blog not found"
            })
        }

        blog.image = blogImage;
        await blog.save();

        return res.status(200).json({
            success:true,
            message:"blog image uploaded successfully",
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"failed to save blog image"
        })
    }
}
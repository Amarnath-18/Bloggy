// import Blog from "../models/Blog.js";
import User from "../models/User.js";
import cloudinary from "../uploads/cloudinary.js";

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const updateProfilePic = async(req, res) => {
    try {
        const userId = req.user._id;
        const profilePic = req.files?.profilePic;

        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "No profile picture provided"
            });
        }

        if (!allowedTypes.includes(profilePic.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image type"
            });
        }

        if (profilePic.size > 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Image exceeds 1MB size limit"
            });
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            profilePic.tempFilePath,
            { folder: "profilePics" }
        );

        const user = await User.findById(userId);
        user.profilePic = cloudinaryResponse.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profilePic: cloudinaryResponse.secure_url
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update profile picture"
        });
    }
}
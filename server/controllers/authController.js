import { validateLogin, validateRegister } from "../helpers/validator.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../uploads/cloudinary.js";
import Blog from "../models/Blog.js";
dotenv.config();
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']; // allowed image types

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    validateRegister(req);
    const profilePic = req.files.profilePic;
    if (!allowedTypes.includes(profilePic.mimetype)) {
      return res.status(400).json({ message: "Invalid image type" });
    }
    if (profilePic.size > 1024 * 1024) {
      return res.status(400).json({ message: "Image exceeds 1MB size limit" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const cloudinaryProfilePicUrl = await cloudinary.uploader.upload(
      profilePic.tempFilePath,
      { folder: "profilePics"  }
    )
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic: cloudinaryProfilePicUrl.secure_url,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    validateLogin(req);

    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      loginUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      user: {
        _id: loginUser._id,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        email: loginUser.email,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, // manipulation form server
      secure: false, // false for http req
      sameSite: "Lax",
    });

    res.status(200).json({
      success:true,
      message:"logOut successfull"
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"logout unsuccessfull",
    })
  }
};

export const getUserProfile = async (req , res)=>{
  try {

    const userId = req.params.id;
    if(!userId){
      return res.status(404).json({
        success:false,
        message:"userId cannot be undefiend"
      })
    }
    const user = await User.findById(userId).select("-password -__v");
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User is not found or userId is invalid"
      })
    }

    const totalBlogs = await Blog.countDocuments({
      author:userId
    })

    return res.status(200).json({
      success:true,
      message:"User details fetched successfully",
      data: {
        user ,
        totalBlogs
      },
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false ,
      error:error.message,
      message:"failed to get userProfile"
    })
  }
}

export const changePassword = async(req , res)=>{
  try {
    const userId = req.user._id;
    const {newPassword , oldPassword} = req.body;

    if(!newPassword || !oldPassword){
      return res.status(400).json({
        success:false,
        message:"newPassword or oldPassword is missing"
      })
    }

    const user = await User.findById(userId);
    const isValidPassword = await bcrypt.compare(oldPassword , user.password);
    if(!isValidPassword){
      return res.status(400).json({
        success:false,
        message:"Old password is wrong"
      })
    }
    const newValidPassword = await bcrypt.hash(newPassword , 10);
    user.password = newValidPassword;
    await user.save();

    return res.status(200).json({
      success:true,
      message:"Password has been changed successfully",
      data: {
        id:userId,
        email:user.email
      }
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      error:error.message,
      message:"failed to changePassword"
    })
  }
}

export const updateProfile = async (req , res)=>{
  try {
    const {firstName , lastName , email , bio} = req.body;
    const userId = req.user._id;
    if(!userId){
      return res.status(402).json({
        success:false,
        message:"userId can not undefiend"
      })
    }


    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, bio },
      { new: true }
    );
    

    return res.status(200).json({
      success:true,
      message:"User updated successfully",
      data : user
    })

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      error:error.message,
      message:"failed to update profile"
    })
  }
}
import { validateLogin, validateRegister } from "../helpers/validator.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    validateRegister(req);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
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
    const isPasswordCorrect = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: loginUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Lax',
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


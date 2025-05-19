//Sign up new user endpoint creating

import cloudinary from "../lib/Cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  if (!req.body) {
    return res.status(400).json({ success: false, message: "Empty body sent" });
  }

  try {
    if (!fullname || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Account Created",
      token,
      userData: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      token,
      userData,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Check Auth

const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//controller to update user profile

const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullname } = req.body;

    const userId = req.user_id;

    let updateduser;

    if (!profilePic) {
      updateduser = await User.findByIdAndUpdate(
        userId,
        { bio, fullname },
        { new: true }
      );
    } else {
      const uploading = await cloudinary.uploader.upload(profilePic);
      updateduser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploading.secure_url, bio, fullname },
        { new: true }
      );
    }

    res.json({ success: true, user: updateduser, message: "Profile Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { signup, login, checkAuth, updateProfile };

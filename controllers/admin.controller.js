import adminModel from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/GenerateToken.js";

export const signupAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isAdmin = await adminModel.findOne({ email });
    if (isAdmin) {
      return res.json({ success: false, message: "Admin already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      username,
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    const token = generateToken({ id: admin._id });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Admin sign-up successful.",
    });
  } catch (error) {
    console.error("Admin sign-up error:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin || email !== ADMIN_EMAIL) {
      return res.status(400).json({ message: "Invalid admin credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid admin credentials." });
    }

    const token = generateToken({ email, role: "admin" });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Admin login successful.",
      admin: {
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.status(200).json({ message: "Admin logged out successfully!" });
  } catch (error) {
    console.error("Admin logout error:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

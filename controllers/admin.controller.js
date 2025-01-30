import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/GenerateToken.js";

export const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists." });
    }

    const newAdmin = await Admin.create({ email, password });

    const token = generateToken({ id: newAdmin._id, role: "admin" });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    await newAdmin.save();
    res.redirect("/auth/admindashboard");
  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.correctPassword(password))) {
      return res.render("admin/invalid");
    }

    const token = generateToken({ id: admin._id, role: admin.role });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      sameSite: "strict",
    });

    res.redirect("/auth/admindashboard");

    // res.status(200).json({
    //   message: "Admin login successful.",
    //   admin: { email: admin.email, role: admin.role },
    // });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
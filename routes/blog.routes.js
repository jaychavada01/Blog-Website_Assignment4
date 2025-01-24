import express from "express";
import multer from "multer";
import {
  createBlog,
  allBlogs,
  searchBlogs,
} from "../controllers/blog.controller.js";
import { verifyToken, isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Image storage engine
const storage = multer.diskStorage({
  destination: "uploads", // Folder to save uploaded files
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Upload setup with multer
const upload = multer({ storage });

// Routes
router.post("/add", verifyToken, isAdmin, upload.single("image"), createBlog);
router.get("/list", verifyToken, allBlogs); // Ensure only logged-in users can access
router.get("/search", verifyToken, searchBlogs); // Ensure only logged-in users can search

export default router;

import express from "express";
import multer from "multer";
import {
  createBlog,
  allBlogs,
  searchBlogs,
  getBlogBySlug,
} from "../controllers/blog.controller.js";
import { adminMiddleware } from "../middleware/auth.js";

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

router.post("/add", adminMiddleware, upload.single("image"), createBlog);
router.post("/search", searchBlogs);

router.get("/", allBlogs);
router.get("/blog/:slug", getBlogBySlug);

export default router;

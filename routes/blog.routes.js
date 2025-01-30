import express from "express";
import multer from "multer";
import {
  createBlog,
  allBlogs,
  searchBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { adminMiddleware } from "../middleware/auth.js";
import BlogModel from "../models/blog.model.js";
import CategoryModel from "../models/category.model.js";

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
router.get("/search", searchBlogs);

router.get("/", allBlogs);
router.get("/blog/:slug", getBlogBySlug);
router.get("/allblog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOne({ slug }).populate('category');

    if (!blog) {
      return res.status(404).render("error", {
        message: "Blog not found",
      });
    }

    res.render("blog", { 
      blog,
      categoryName: blog.category ? blog.category.name : 'Uncategorized'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//? editing and deleting blog
router.put("/blog/:slug", updateBlog);
router.delete("/blog/:slug", deleteBlog);

export default router;

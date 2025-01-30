import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminMiddleware } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/add", adminMiddleware, upload.none(), createCategory);

router.get("/getOne/:id", getCategoryById);
//? update and delete Category Routes
router.put("/updateOne/:id", updateCategory);
router.delete("/deleteOne/:id", deleteCategory);

export default router;

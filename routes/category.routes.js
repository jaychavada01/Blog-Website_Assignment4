import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", adminMiddleware, createCategory);
router.put("/:id", adminMiddleware, updateCategory);
router.delete("/:id", adminMiddleware, deleteCategory);

router.get("/all", getAllCategories);

export default router;

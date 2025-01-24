import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { isAdmin, verifyToken } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

router.get("/all",verifyToken, getAllCategories);

export default router;

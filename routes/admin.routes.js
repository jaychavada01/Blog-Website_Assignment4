import express from "express";
import { loginAdmin, logoutAdmin, signupAdmin } from "../controllers/admin.controller.js";
import { isAdmin, verifyToken } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post('/signup', signupAdmin)
router.post("/signin", loginAdmin);
router.post("/logout", verifyToken, isAdmin, logoutAdmin);

export default router;

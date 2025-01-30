import express from "express";
import { loginAdmin, signupAdmin } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middleware/auth.js";
import { adminDashboard } from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", loginAdmin);

// ? admin logout
router.post("/logout", adminMiddleware, (req, res) => {
  res.clearCookie("token"); // Clear the admin token stored in cookies
  res.redirect("/"); // Redirect to home page
});

//? admin routes
router.get("/admindashboard", adminDashboard);

export default router;

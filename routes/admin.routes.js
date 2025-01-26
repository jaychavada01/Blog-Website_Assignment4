import express from "express"
import { loginAdmin, logoutAdmin, signupAdmin } from "../controllers/admin.controller.js"
import { adminMiddleware } from "../middleware/auth.js"
import { adminPanel,adminDashboard } from "../controllers/blog.controller.js"

const router = express.Router()

router.post("/signup", signupAdmin)
router.post("/signin", loginAdmin)
router.post("/logout", adminMiddleware, logoutAdmin)

//? admin routes
router.get("/admin", adminPanel);
router.get('/admindashboard', adminDashboard)

export default router
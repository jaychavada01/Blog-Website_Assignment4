import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js"

export const adminMiddleware = async (req, res, next) => {
  try {
    let token
    if (req.cookies.jwt) {
      token = req.cookies.jwt
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(decoded.id).select("-password")

    if (!admin) {
      return res.status(401).json({ message: "Not authorized, token failed" })
    }

    req.admin = admin
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}

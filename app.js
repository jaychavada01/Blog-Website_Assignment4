import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import BlogModel from "./models/blog.model.js";
import Category from "./models/category.model.js";

import Database from "./db/Database.js";

import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";

dotenv.config();
Database();

const app = express();
const PORT = process.env.PORT || 3001;

//? Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(cors());
app.use(express.static("public"));

//? Set up EJS as the template engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//? Routes
app.use("/auth", adminRoutes);
app.use("/", blogRoutes);
app.use("/categories", categoryRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

// Route to fetch all blogs
app.get('/allblogs', async (req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 }).populate('category');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs.' });
  }
});

// Route to fetch all category
app.get("/allcategories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Assuming you have a Category model
    res.json(categories); // Return categories as JSON
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
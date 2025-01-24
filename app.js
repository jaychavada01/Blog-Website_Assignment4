import express from "express";
import cors from "cors";
import Database from "./db/Database.js";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

//? Routes
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";

//? Database connection
Database();

const app = express();
const PORT = process.env.PORT || 3001;

// ? Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//? Routes
app.use("/auth", adminRoutes);
app.use("/blogs", blogRoutes);
app.use("/images", express.static("uploads"));
app.use("/categories", categoryRoutes);

//? Route handler for the home page
app.get('/', (req, res) => {
  res.send("<h1>Welcome to the home page</h1>")
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

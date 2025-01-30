import BlogModel from "../models/blog.model.js";
import CategoryModel from "../models/category.model.js";
import mongoose from "mongoose";

// Utility function to generate a slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, category, slug } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Title, description, and category are required" });
    }

    // Check if the category exists
    const existingCategory = await CategoryModel.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Handle optional image file
    const image_file = req.file ? req.file.filename : null;

    // Generate a slug if not provided
    let blogSlug = slug || generateSlug(title);

    // Ensure slug is unique
    let slugExists = await BlogModel.findOne({ slug: blogSlug });
    let counter = 1;
    while (slugExists) {
      blogSlug = `${generateSlug(title)}-${counter}`;
      slugExists = await BlogModel.findOne({ slug: blogSlug });
      counter++;
    }

    // Create and save the new blog
    const newBlog = new BlogModel({
      title,
      description,
      category,
      slug: blogSlug,
      image: image_file,
    });
    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error("Error in createBlog controller:", error);
  }
};

export const allBlogs = async (req, res) => {
  try {
    // Fetch all blogs sorted by creation date (most recent first)
    const blogs = await BlogModel.find({})
      .sort({ createdAt: -1 })
      .populate("category", "name") // Fetch category name instead of ID
      .exec();
    const categories = await CategoryModel.find();
    res.render("index", {
      blogs,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in allBlogs controller:", error);
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json(blog);
    // res.render("blog", { blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json({ success: true, updatedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await BlogModel.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json({ success: !!deletedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      return res.status(400).json({ message: "Search query is empty" });
    }

    // Fetch blogs matching the query by title (case-insensitive)
    const blogs = await BlogModel.find({ title: { $regex: query, $options: "i" } });

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminLayout = "../views/layouts/admin.ejs";
export const adminDashboard = async (req, res) => {
  try {
    const blogs = await BlogModel.find({})
      .sort({ createdAt: -1 })
      .populate("category");
    const categories = await CategoryModel.find({}).sort({ name: 1 });

    res.render("admin/dashboard", { blogs, categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
};

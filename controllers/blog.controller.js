import BlogModel from "../models/blog.model.js";
import CategoryModel from "../models/category.model.js";

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
    const image_file = req.file ? req.file.path : null;

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
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in allBlogs controller:", error);
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const { title } = req.query; // Extract the search keyword from query parameters

    // Validate the search input
    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "Search query (title) is required" });
    }

    // Use a case-insensitive, partial match search
    const blogs = await BlogModel.find({
      title: { $regex: title, $options: "i" },
    }).populate("category");

    // Check if any blogs are found
    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found for the given title" });
    }

    // Respond with the matching blogs
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error("Error in searchBlogs controller:", error);
  }
};

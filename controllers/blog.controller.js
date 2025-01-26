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
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });

    res.render("index", {
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in allBlogs controller:", error);
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOne({ slug }).populate("category");

    // If no blog is found, respond with a 404 error
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // console.log(blog.image);
    res.render("blog", { blog });
  } catch (error) {
    // Handle server errors
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNospecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    // Validate the search input
    if (searchTerm === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Use a case-insensitive, partial match search
    const blogs = await BlogModel.find({
      $or: [
        { title: { $regex: searchNospecialChar, $options: "i" } },
        { body: { $regex: searchNospecialChar, $options: "i" } },
      ],
    }).populate("category");

    // Check if any blogs are found
    if (blogs.length === 0) {
      return res
        .status(404)
        .render('404')
    }
    // console.log(blogs);
    res.render("search", { blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error("Error in searchBlogs controller:", error);
  }
};

const adminLayout = '../views/layouts/admin.ejs'
export const adminPanel = async (req, res) => {
  try {
    const locals = {
      title: "blog",
      description: "simple blog created with nodejs and mongodb",
    };

    res.render("admin/adminIndex", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
}

export const adminDashboard = async (req, res) => {
  try {
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });
    const categories = await CategoryModel.find({}).sort({ name: 1 });

    res.render("admin/dashboard", { blogs, categories,layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
}
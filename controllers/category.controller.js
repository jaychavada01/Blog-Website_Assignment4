import CategoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name?.trim();

    // Check if the category name exists
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const newCategory = new CategoryModel({ name });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    // console.log('Category ID:', req.params.id); // Log the received ID
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      console.log('Category not found'); // Log if the category is not found
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error('Error:', error); // Log any error that occurs
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ success: true, updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ success: true, deletedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
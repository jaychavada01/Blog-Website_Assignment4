import CategoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate if the name is provided
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Check if the category already exists
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        // Create and save new category
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

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({}).sort({ name: 1 }); // Sort categories alphabetically
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params; // Category ID from URL parameters
        const { name } = req.body; // New name for the category

        // Validate if the name is provided
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Check if the category exists
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Update the category name
        category.name = name;
        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; // Category ID from URL parameters

        // Check if the category exists
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Delete the category
        await CategoryModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
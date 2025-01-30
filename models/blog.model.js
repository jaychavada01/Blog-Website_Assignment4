import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary whitespaces
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
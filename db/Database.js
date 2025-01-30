import mongoose from "mongoose";

const Database = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🍃 Database connected successfully");
  } catch (error) {
    console.log("🍃 Database connection failed", error);
  }
};

export default Database;

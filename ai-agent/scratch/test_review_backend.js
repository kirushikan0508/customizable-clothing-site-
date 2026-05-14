import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../backend/models/Review.js";
import Product from "../backend/models/Product.js";
import User from "../backend/models/User.js";

dotenv.config({ path: "../backend/.env" });

async function testReview() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get a test product
    const product = await Product.findOne();
    if (!product) {
      console.log("No products found");
      return;
    }

    // Get a test user
    const user = await User.findOne();
    if (!user) {
      console.log("No users found");
      return;
    }

    console.log(`Testing review for product: ${product._id} by user: ${user._id}`);

    // Check if review exists and delete it to avoid unique constraint error
    await Review.deleteOne({ user: user._id, product: product._id });

    // Create a review
    const review = await Review.create({
      user: user._id,
      product: product._id,
      rating: 5,
      comment: "Test review from script",
    });

    console.log("Review created successfully:", review._id);

    // Test population
    await review.populate("user", "name avatar");
    console.log("Review populated successfully:", review.user.name);

    // Check product ratings
    const updatedProduct = await Product.findById(product._id);
    console.log("Updated product ratings:", updatedProduct.ratings, updatedProduct.numReviews);

    // Clean up
    await Review.deleteOne({ _id: review._id });
    console.log("Cleanup complete");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

testReview();

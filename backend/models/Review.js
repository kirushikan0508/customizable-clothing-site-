import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

// Static method to update product ratings
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model("Product");
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
      numReviews: 0,
    });
  }
};

// Update ratings after save
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

// Update ratings after remove
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;

import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    gender: {
      type: String,
      enum: ["boys", "girls", "unisex"],
      required: true,
    },
    brand: { type: String, default: "FLAVOUR" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    images: [{ url: String, public_id: String }],
    sizes: [
      {
        size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    stock: { type: Number, required: true, default: 0, min: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for reviews
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

// Auto-generate slug from title
productSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  }
  // Calculate total stock from sizes if sizes exist
  if (this.isModified("sizes") && this.sizes.length > 0) {
    this.stock = this.sizes.reduce((total, s) => total + s.stock, 0);
  }
  next();
});

// Indexes for search and filtering
productSchema.index({ title: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, trending: 1, isNewArrival: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;

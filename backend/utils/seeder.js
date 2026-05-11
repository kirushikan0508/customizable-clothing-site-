import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";

dotenv.config();

const categories = [
  { name: "Plain T-Shirts", slug: "plain-t-shirts", description: "Essential plain t-shirts for everyday wear" },
  { name: "Printed T-Shirts", slug: "printed-t-shirts", description: "Trendy and vibrant printed t-shirts" },
  { name: "Normal T-Shirts", slug: "normal-t-shirts", description: "Comfortable normal t-shirts for all occasions" },
];

const colors = [
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1B2A4A" }, { name: "Gray", hex: "#6B7280" },
  { name: "Red", hex: "#DC2626" }, { name: "Blue", hex: "#2563EB" },
  { name: "Pink", hex: "#EC4899" }, { name: "Beige", hex: "#D2B48C" },
  { name: "Olive", hex: "#556B2F" }, { name: "Burgundy", hex: "#800020" },
];

const sizes = [
  { size: "XS", stock: 15 }, { size: "S", stock: 25 },
  { size: "M", stock: 30 }, { size: "L", stock: 25 },
  { size: "XL", stock: 15 }, { size: "XXL", stock: 10 },
];

const placeholderImg = (id, w = 800, h = 1000) => ({
  url: `https://picsum.photos/seed/flv_tshirt_${id}/${w}/${h}`,
  public_id: `flavour/seed_tshirt_${id}`,
});

const productData = [
  // PLAIN T-SHIRTS (catIdx: 0)
  { title: "Essential Crew Neck Plain Tee", description: "The perfect everyday plain t-shirt. Made from 100% combed cotton with a relaxed fit. Pre-shrunk for a consistent fit wash after wash.", catIdx: 0, gender: "unisex", brand: "FLAVOUR", price: 799, discountPrice: 599, colorIdx: [0, 1, 2, 3, 4], featured: true, trending: true, isNewArrival: false },
  { title: "Premium V-Neck Plain T-Shirt", description: "Soft vintage-washed v-neck tee with a lived-in feel. The garment-dyed process gives each piece a unique character.", catIdx: 0, gender: "unisex", brand: "FLAVOUR", price: 899, discountPrice: 699, colorIdx: [0, 3, 8], featured: false, trending: false, isNewArrival: false },
  { title: "Heavyweight Boxy Plain Tee", description: "A structured, heavyweight plain t-shirt perfect for layering or wearing on its own.", catIdx: 0, gender: "boys", brand: "FLAVOUR", price: 1099, discountPrice: 899, colorIdx: [1, 7, 4], featured: false, trending: true, isNewArrival: true },
  { title: "Fitted Ribbed Plain Tee", description: "A stretchy, fitted ribbed plain t-shirt that highlights your silhouette.", catIdx: 0, gender: "girls", brand: "FLAVOUR", price: 699, discountPrice: 0, colorIdx: [5, 6], featured: false, trending: false, isNewArrival: true },
  { title: "Oversized Drop Shoulder Plain Tee", description: "Ultra-comfortable oversized plain tee with a drop shoulder design.", catIdx: 0, gender: "unisex", brand: "FLAVOUR", price: 999, discountPrice: 799, colorIdx: [0, 2], featured: true, trending: false, isNewArrival: false },
  { title: "Soft Cotton Slub Plain Tee", description: "Textured slub cotton gives this plain tee a unique, premium feel.", catIdx: 0, gender: "unisex", brand: "FLAVOUR", price: 849, discountPrice: 649, colorIdx: [7, 8, 9], featured: false, trending: false, isNewArrival: false },

  // PRINTED T-SHIRTS (catIdx: 1)
  { title: "Graphic Print Oversized Tee", description: "Trendy oversized t-shirt featuring exclusive graphic prints. Made from heavyweight cotton for a premium drape and feel.", catIdx: 1, gender: "unisex", brand: "FLAVOUR", price: 1299, discountPrice: 999, colorIdx: [0, 1, 8], featured: false, trending: true, isNewArrival: true },
  { title: "Tie-Dye Relaxed Printed Tee", description: "Express your style with this unique tie-dye pattern tee. Each piece is individually dyed making every shirt one of a kind.", catIdx: 1, gender: "girls", brand: "FLAVOUR", price: 999, discountPrice: 0, colorIdx: [5, 6, 4], featured: false, trending: true, isNewArrival: true },
  { title: "Vintage Band Logo Tee", description: "A cool printed tee featuring a retro band logo. Perfect for a casual, edgy look.", catIdx: 1, gender: "unisex", brand: "FLAVOUR", price: 1199, discountPrice: 899, colorIdx: [0, 3], featured: true, trending: true, isNewArrival: false },
  { title: "Minimalist Typography Printed Tee", description: "Clean and simple typography print on a soft cotton tee.", catIdx: 1, gender: "unisex", brand: "FLAVOUR", price: 899, discountPrice: 699, colorIdx: [1, 2], featured: false, trending: false, isNewArrival: false },
  { title: "Abstract Art Printed T-Shirt", description: "Wearable art featuring abstract splashes of color.", catIdx: 1, gender: "unisex", brand: "FLAVOUR", price: 1499, discountPrice: 1199, colorIdx: [1, 5, 6], featured: true, trending: false, isNewArrival: true },
  { title: "Logo Chest Print Tee", description: "Our classic logo subtly printed on the left chest. Simple but effective.", catIdx: 1, gender: "boys", brand: "FLAVOUR", price: 999, discountPrice: 799, colorIdx: [0, 1, 2], featured: false, trending: false, isNewArrival: false },

  // NORMAL T-SHIRTS (catIdx: 2)
  { title: "Classic Fit Normal T-Shirt", description: "The standard classic fit normal t-shirt. Not too tight, not too loose. Just right.", catIdx: 2, gender: "unisex", brand: "FLAVOUR", price: 749, discountPrice: 549, colorIdx: [0, 1, 3], featured: true, trending: false, isNewArrival: false },
  { title: "Athletic Performance Tee", description: "Moisture-wicking normal t-shirt designed for active lifestyles. Quick-dry technology keeps you comfortable during workouts.", catIdx: 2, gender: "unisex", brand: "FLAVOUR", price: 1199, discountPrice: 899, colorIdx: [0, 3, 5], featured: false, trending: false, isNewArrival: false },
  { title: "Polo Classic Fit T-Shirt", description: "Timeless polo shirt with ribbed collar and cuffs. The classic fit and premium piqué cotton fabric make this a versatile wardrobe staple.", catIdx: 2, gender: "boys", brand: "FLAVOUR", price: 1499, discountPrice: 1199, colorIdx: [0, 2, 4, 5], featured: true, trending: false, isNewArrival: false },
  { title: "Long Sleeve Normal Tee", description: "A comfortable long sleeve t-shirt for those cooler days.", catIdx: 2, gender: "unisex", brand: "FLAVOUR", price: 1099, discountPrice: 899, colorIdx: [1, 2, 7], featured: false, trending: true, isNewArrival: true },
  { title: "Striped Normal T-Shirt", description: "Classic horizontal stripes on a soft, normal-fit t-shirt.", catIdx: 2, gender: "unisex", brand: "FLAVOUR", price: 899, discountPrice: 699, colorIdx: [0, 1, 2], featured: false, trending: false, isNewArrival: false },
  { title: "Ringer Normal T-Shirt", description: "Retro-inspired ringer tee with contrasting collar and sleeve bands.", catIdx: 2, gender: "unisex", brand: "FLAVOUR", price: 949, discountPrice: 0, colorIdx: [1, 4, 5], featured: false, trending: true, isNewArrival: true },
];

const coupons = [
  { code: "WELCOME10", description: "10% off your first order", discountType: "percentage", discountValue: 10, minOrderAmount: 500, maxDiscount: 200, usageLimit: 100, startDate: new Date(), endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true },
  { code: "FLAT200", description: "Flat Rs. 200 off on orders above Rs. 1500", discountType: "fixed", discountValue: 200, minOrderAmount: 1500, maxDiscount: 0, usageLimit: 50, startDate: new Date(), endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
  { code: "SUMMER25", description: "25% off summer collection", discountType: "percentage", discountValue: 25, minOrderAmount: 1000, maxDiscount: 500, usageLimit: 0, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Product.deleteMany({}),
      Category.deleteMany({}), Coupon.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const admin = await User.create({
      name: "Admin", email: "admin@flavour.com",
      password: "admin123", phone: "9999999999", role: "admin",
    });

    // Create test user
    const testUser = await User.create({
      name: "John Doe", email: "john@example.com",
      password: "password123", phone: "0777123456", role: "user",
      addresses: [{ fullName: "John Doe", phone: "0777123456", street: "123 Galle Road", city: "Colombo", state: "Western", zipCode: "00300", country: "Sri Lanka", isDefault: true }],
    });
    console.log("👤 Created users");

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log("📁 Created categories");

    // Create products
    const products = productData.map((p, idx) => ({
      title: p.title,
      slug: p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description: p.description,
      category: createdCategories[p.catIdx]._id,
      gender: p.gender,
      brand: p.brand,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [placeholderImg(idx * 3), placeholderImg(idx * 3 + 1), placeholderImg(idx * 3 + 2)],
      sizes: sizes.map((s) => ({ ...s })),
      colors: p.colorIdx.map((ci) => colors[ci]),
      stock: 120,
      ratings: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      numReviews: Math.floor(Math.random() * 50) + 5,
      featured: p.featured,
      trending: p.trending,
      isNewArrival: p.isNewArrival,
      soldCount: Math.floor(Math.random() * 200),
    }));

    await Product.insertMany(products);
    console.log(`🛍️  Created ${products.length} products`);

    // Create coupons
    await Coupon.insertMany(coupons);
    console.log("🎫 Created coupons");

    console.log("\n✨ Database seeded successfully!");
    console.log(`   Admin: admin@flavour.com / admin123`);
    console.log(`   User:  john@example.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

seedDB();

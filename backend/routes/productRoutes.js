import express from "express";
import { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct, addReview, getProductReviews, getAdminProducts } from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/all", protect, admin, getAdminProducts);
router.get("/id/:id", getProductById);
router.get("/:slug", getProductBySlug);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/reviews", protect, addReview);
router.get("/:id/reviews", getProductReviews);

export default router;

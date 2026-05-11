import express from "express";
import { getProfile, updateProfile, addAddress, updateAddress, deleteAddress, toggleWishlist, getWishlist, getAllCustomers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.post("/wishlist", toggleWishlist);
router.get("/wishlist", getWishlist);
router.get("/admin/customers", admin, getAllCustomers);

export default router;

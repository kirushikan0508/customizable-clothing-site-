import express from "express";
import { upload, uploadToCloudinary } from "../middleware/upload.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Upload single image
router.post("/single", protect, admin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const result = await uploadToCloudinary(req.file.buffer, "flavour/products");
    res.json({ success: true, image: result });
  } catch (error) { next(error); }
});

// Upload multiple images
router.post("/multiple", protect, admin, upload.array("images", 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "No files uploaded" });
    const results = await Promise.all(req.files.map((file) => uploadToCloudinary(file.buffer, "flavour/products")));
    res.json({ success: true, images: results });
  } catch (error) { next(error); }
});

export default router;

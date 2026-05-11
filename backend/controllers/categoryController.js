import Category from "../models/Category.js";
import { NotFoundError } from "../utils/ApiError.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new NotFoundError("Category not found");
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new NotFoundError("Category not found");
    Object.assign(category, req.body);
    await category.save();
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new NotFoundError("Category not found");
    category.isActive = false;
    await category.save();
    res.json({ success: true, message: "Category deleted" });
  } catch (error) { next(error); }
};

export const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

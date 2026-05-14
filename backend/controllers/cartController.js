import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { NotFoundError, BadRequestError } from "../utils/ApiError.js";

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "title images price discountPrice stock sizes slug"
    );

    if (!cart) {
      cart = { items: [], totalPrice: 0, totalItems: 0 };
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color, customization, customPrice } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (product.stock < quantity) {
      throw new BadRequestError("Insufficient stock");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart (same product + size + color)
    // For custom items, we skip grouping for now to avoid complexity with identical designs
    const existingIndex = customization 
      ? -1 
      : cart.items.findIndex(
          (item) =>
            item.product.toString() === productId &&
            item.size === size &&
            item.color === (color || "") &&
            !item.customization?.isCustom
        );

    const itemPrice = customPrice || (product.discountPrice > 0 ? product.discountPrice : product.price);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].price = itemPrice;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color: color || "",
        price: itemPrice,
        customization: customization || { isCustom: false },
      });
    }

    await cart.save();

    // Populate for response
    await cart.populate(
      "items.product",
      "title images price discountPrice stock sizes slug"
    );

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) throw new NotFoundError("Cart not found");

    const item = cart.items.id(req.params.itemId);
    if (!item) throw new NotFoundError("Item not found in cart");

    // Check stock
    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      throw new BadRequestError("Insufficient stock");
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate(
      "items.product",
      "title images price discountPrice stock sizes slug"
    );

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError("Cart not found");

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    await cart.populate(
      "items.product",
      "title images price discountPrice stock sizes slug"
    );

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

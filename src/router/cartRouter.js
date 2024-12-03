const express = require("express");
require("dotenv").config();
const Cart = require("../models/cart.schema");
const Card = require("../models/foodCard.schema");
const userAuth = require("../middlewares/userAuth");
const mongoose = require("mongoose");
const FRONTEND_URL = process.env.FRONTEND_URL;

const cartRouter = express.Router();

cartRouter.post("/cart", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const { cardId } = req.body;
    if (!cardId) {
      return res.status(400).json({ message: "Missing required field" });
    }

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid cardId format" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "card not found" });
    }

    const price = card.cost;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            cardId,
            quantity: 1,
            price,
          },
        ],
      });
    } else {
      const cartIndex = cart.items.findIndex(
        (item) => item.cardId.toString() === cardId
      );

      if (cartIndex >= 0) {
        cart.items[cartIndex].quantity += 1;
        cart.items[cartIndex].price = price * cart.items[cartIndex].quantity;
      } else {
        cart.items.push({ cardId, quantity: 1, price });
      }
    }

    await cart.save();

    return res.status(201).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: "400" });
  }
});

cartRouter.get("/cart", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const cart = await Cart.findOne({ userId }).populate("items.cardId");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: [],
        totalPrice: 0,
      });
    }
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.price;
    });

    return res.status(200).json({
      message: "Cart fetched successfully",
      cartId: cart._id,
      cart: cart.items,
      totalPrice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

cartRouter.delete("/cart/:cardId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    const cartIndex = cart.items.findIndex(
      (item) => item.cardId.toString() === cardId
    );

    if (cartIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (cart.items[cartIndex].quantity > 1) {
      cart.items[cartIndex].quantity -= 1;
      cart.items[cartIndex].price -=
        cart.items[cartIndex].price / (cart.items[cartIndex].quantity + 1);
    } else {
      cart.items.splice(cartIndex, 1);
    }

    await cart.save();

    return res.status(200).json({
      message: "Item updated in the cart",
      cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
});

cartRouter.get("/cart/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid Cart ID" });
    }

    const cart = await Cart.findById(cartId).populate("items.cardId");
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.price;
    });
    return res.status(200).json({
      message: "Cart fetched successfully",
      cartId: cart._id,
      cart: cart.items,
      totalPrice,
      cartUserId:cart.userId
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

cartRouter.post("/cart/share", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const shareableLink = `${FRONTEND_URL}/checkout/${cart._id}`;

    return res.status(200).json({ message: "link generated", shareableLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error generating link", error: error.message });
  }
});

cartRouter.delete("/cart/clear/:cartId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { cartId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid Cart ID format" });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "You cannot proceed to payment because your cart is empty." });
    }

    if (cart.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to clear this cart" });
    }

    cart.items = [];


    await Cart.deleteOne({ _id: cartId });

    return res.status(200).json({
      message: "Order placed successfully",
      cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
});

module.exports = cartRouter;

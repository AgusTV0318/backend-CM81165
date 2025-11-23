import express from "express";
import CartManager from "../managers/CartManager.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({
      status: "success",
      payload: carts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();

    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: cart.products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

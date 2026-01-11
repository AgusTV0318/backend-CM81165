import express from "express";
import cartDao from "../dao/cartDao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartDao.getAllCarts();
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
    const newCart = await cartDao.createCart();

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
    const cart = await cartDao.getCartById(req.params.cid);

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
    const updatedCart = await cartDao.addProductToCart(
      req.params.cid,
      req.params.pid
    );

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

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartDao.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "El campo products debe ser un array",
      });
    }

    const updatedCart = await cartDao.updateCart(req.params.cid, products);

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

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser un número mayor a 0",
      });
    }

    const updatedCart = await cartDao.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );

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

router.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartDao.clearCart(req.params.cid);

    res.json({
      status: "success",
      message: "Carrito vaciado correctamente",
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

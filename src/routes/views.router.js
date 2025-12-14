import express from "express";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Lista de Productos",
      products: products,
      hasProducts: products.length > 0,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar los productos",
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Products en Tiempo Real",
      products: products,
      hasProducts: products.length > 0,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar los productos",
    });
  }
});

export default router;

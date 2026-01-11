import express from "express";
import productDao from "../dao/productDao.js";
import cartDao from "../dao/cartDao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, status } = req.query;

    const result = await productDao.getProducts({
      page,
      limit,
      sort,
      category,
      status,
    });

    res.render("products", {
      title: "Products",
      products: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      category,
      sort,
      status,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar los productos",
    });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productDao.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).render("error", {
        error: "Producto no encotrado",
      });
    }

    res.render("productDetail", {
      title: product.title,
      product: product,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar el producto",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartDao.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).render("error", {
        error: "Carrito no encontrado",
      });
    }

    res.render("cart", {
      title: "Mi Carrito",
      cart: cart,
      cartId: req.params.cid,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar el carrito",
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productDao.getProducts({});
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products: result.payload,
      hasProducts: result.payload.length > 0,
    });
  } catch (error) {
    res.status(500).render("error", {
      error: "Error al cargar los productos",
    });
  }
});

export default router;

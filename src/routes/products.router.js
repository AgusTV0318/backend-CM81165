import express from "express";
import productDao from "../dao/productDao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query, category, status } = req.query;

    const result = await productDao.getProducts({
      limit,
      page,
      sort,
      query,
      category,
      status,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productDao.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: product,
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
    const newProduct = await productDao.addProduct(req.body);

    const io = req.app.get("io");
    const result = await productDao.getProducts({});
    io.emit("updateProducts", result.payload);

    res.status(201).json({
      status: "success",
      payload: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productDao.updateProduct(
      req.params.pid,
      req.body
    );

    const io = req.app.get("io");
    const result = await productDao.getProducts({});
    io.emit("updateProducts", result.payload);

    res.json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    await productDao.deleteProduct(req.params.pid);

    const io = req.app.get("io");
    const result = await productDao.getProducts({});
    io.emit("updateProducts", result.payload);

    res.json({
      status: "success",
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

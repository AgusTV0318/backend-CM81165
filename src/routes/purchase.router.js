import express from "express";
import purchaseService from "../services/purchaseService.js";

const router = express.Router();

router.post("/:cid/purchase", async (req, res) => {
  try {
    const { purchaserEmail } = req.body;

    if (!purchaserEmail) {
      return res.status(400).json({
        status: "error",
        message: "El email del comprador es requerido",
      });
    }

    const result = await purchaseService.processPurchase(
      req.params.cid,
      purchaserEmail
    );

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: result.message,
        productsWithoutStock: result.productsWithoutStock,
      });
    }

    res.status(201).json({
      status: "success",
      message: result.message,
      payload: {
        order: result.order,
        productsWithoutStock: result.productsWithoutStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

import cartDao from "../dao/cartDao.js";
import productDao from "../dao/productDao.js";
import orderDao from "../dao/orderDao.js";

class PurchaseService {
  async processPurchase(cartId, purchaserEmail) {
    try {
      const cart = await cartDao.getCartById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      if (!cart.products || cart.products.length === 0) {
        throw new Error(`El carrito esta vacío`);
      }

      if (!purchaserEmail) {
        throw new Error(`Debe proporcionar un email de comprador`);
      }

      const productsToProcess = [];
      const productsWithoutStock = [];

      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;

        const currentProduct = await productDao.getProductById(product._id);

        if (currentProduct.stock >= requestedQuantity) {
          productsToProcess.push({
            product: currentProduct,
            quantity: requestedQuantity,
          });
        } else {
          productsWithoutStock.push({
            productId: product._id,
            title: product.title,
            requestedQuantity,
            availableStock: currentProduct.stock,
          });
        }
      }

      if (productsToProcess.length === 0) {
        return {
          success: false,
          message: "Ningún producto tiene stock suficiente",
          productsWithoutStock,
        };
      }

      const totalAmount = productsToProcess.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      const orderProducts = productsToProcess.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const order = await orderDao.createOrder({
        amount: totalAmount,
        purchaser: purchaserEmail,
        products: orderProducts,
      });

      for (const item of productsToProcess) {
        await productDao.decreaseStock(item.product._id, item.quantity);
      }

      const remainingProducts = cart.products.filter((item) => {
        return productsWithoutStock.some(
          (p) => p.productId.toString() === item.product._id.toString()
        );
      });

      await cartDao.updateCart(cartId, remainingProducts);

      return {
        success: true,
        order: order,
        productsWithoutStock:
          productsWithoutStock.length > 0 ? productsWithoutStock : null,
        message:
          productsWithoutStock.length > 0
            ? "Compra procesada parcialmente. Algunos productos no tenían stock suficiente."
            : "Compra procesada exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al procesar la compra: ${error.message}`);
    }
  }
}

export default new PurchaseService();

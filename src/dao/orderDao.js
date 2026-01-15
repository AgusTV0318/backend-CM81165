import { OrderModel } from "../models/order.model.js";

class OrderDao {
  generateOrderCode() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(orderData) {
    try {
      const code = this.generateOrderCode();
      const order = new OrderModel({
        ...orderData,
        code,
      });
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error al crear orden: ${error.message}`);
    }
  }

  async getOrderById(code) {
    try {
      const order = await OrderModel.findOne({ code }).populate(
        "products.product"
      );
      return order;
    } catch (error) {
      throw new Error(`Error al obtener orden: ${error.message}`);
    }
  }

  async getOrdersByPurchaser(email) {
    try {
      const orders = await OrderModel.find({ purchaser: email })
        .populate("products.product")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error al obtener ordenes: ${error.message}`);
    }
  }

  async getAllOrders() {
    try {
      const orders = await OrderModel.find()
        .populate("products.product")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error al obtener órdenes ${error.message}`);
    }
  }
}

export default new OrderDao();

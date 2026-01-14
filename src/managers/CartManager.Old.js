import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
  constructor() {
    this.path = join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw new Error("Error al guardar los carritos.");
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const id = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

    const newCart = {
      id,
      products: [],
    };

    carts.push(newCart);
    await this.saveCarts(carts);

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado.");
    }

    const cart = carts[cartIndex];

    const productIndex = cart.products.findIndex(
      (item) => item.product === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    carts[cartIndex] = cart;
    await this.saveCarts(carts);

    return cart;
  }
}

export default CartManager;

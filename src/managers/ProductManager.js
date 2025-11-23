import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
  constructor() {
    this.path = join(__dirname, "../data/products.json");
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error("Error al guardar los productos.");
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const { title, description, code, price, stock, category } = productData;

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const codeExists = products.find((product) => product.code === code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    const id =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: productData.status !== undefined ? productData.status : true,
      stock,
      category,
      thumbnails: productData.thumbnails || [],
    };

    products.push(newProduct);
    await this.saveProducts(products);

    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    if (updatedFields.id) {
      delete updatedFields.id;
    }

    products[index] = {
      ...products[index],
      ...updatedFields,
    };

    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    products.splice(index, 1);
    await this.saveProducts(products);

    return true;
  }
}

export default ProductManager;

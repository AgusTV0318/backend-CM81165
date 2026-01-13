import { ProductModel } from "../models/product.model.js";

class ProductDao {
  async getProducts(options = {}) {
    try {
      const { limit = 10, page = 1, sort, query, category, status } = options;

      const filter = {};

      if (query && query.trim() !== "") {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }

      if (category && category !== "" && category !== "Todas") {
        filter.category = category;
      }

      if (status !== undefined && status !== "") {
        filter.status = status === "true" || status === true;
      }

      const paginateOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
      };

      if (sort && sort !== "") {
        paginateOptions.sort = { price: sort === "asc" ? 1 : -1 };
      }

      const result = await ProductModel.paginate(filter, paginateOptions);

      const baseUrl = "/products";
      const params = `&limit=${limit}${sort ? `&sort=${sort}` : ""}${
        category ? `&category=${category}` : ""
      }${status !== undefined ? `&status=${status}` : ""}`;

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${baseUrl}?page=${result.prevPage}${params}`
          : null,
        nextLink: result.hasNextPage
          ? `${baseUrl}?page=${result.nextPage}${params}`
          : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async addProduct(productData) {
    try {
      const product = new ProductModel(productData);
      await product.save();
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(messages.join(", "));
      }
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      if (updateData.code) {
        const existing = await ProductModel.findOne({
          code: updateData.code,
          _id: { $ne: id },
        });
        if (existing) {
          throw new Error("El código del producto ya existe");
        }
      }

      const product = await ProductModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return product;
    } catch (error) {
      if (error.message === "Producto no encontrado") throw error;
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(messages.join(", "));
      }
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default new ProductDao();

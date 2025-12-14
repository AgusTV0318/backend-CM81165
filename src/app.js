import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});

const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
      socket.emit("success", "Producto agregado correctamente");
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(id);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
      socket.emit("success", "Producto eliminado correctamente");
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

export default app;

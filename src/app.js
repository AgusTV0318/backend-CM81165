import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import productDao from "./dao/productDao.js";
import purchaseRouter from "./routes/purchase.router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
      multiply: (a, b) => a * b,
      calculateTotal: (products) => {
        return products.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
      },
      formatDate: (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/carts", purchaseRouter);

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
      const newProduct = await productDao.addProduct(productData);
      const result = await productDao.getProducts({});
      io.emit("updateProducts", result.payload);
      socket.emit("success", "Producto agregado correctamente");
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productDao.deleteProduct(id);
      const result = await productDao.getProducts({});
      io.emit("updateProducts", result.payload);
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

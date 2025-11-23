import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API de e-commerce funcionando.",
    endpoints: {
      products: "/api/products",
      carts: "/api/carts",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server en el puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});

export default app;

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error en la conexión de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose desconectado de MongoDB");
});

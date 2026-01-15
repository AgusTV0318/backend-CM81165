import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchaseDateTime: {
      type: Date,
      default: Date.now,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      dafault: "completed",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const OrderModel = mongoose.model("Order", orderSchema);

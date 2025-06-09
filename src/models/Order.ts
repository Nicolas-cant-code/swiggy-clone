import * as mongoose from "mongoose";
import { model } from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  order: { type: String, required: true },
  instruction: { type: String },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "active" },
  total: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  payment_status: { type: Boolean, required: true },
  payment_mode: { type: String, required: true },
  created_at: {
    type: Date,
    default: new Date(),
    required: true,
  },
  updated_at: { type: Date, default: Date.now, required: true },
});

const Order = model("orders", orderSchema);

export default Order;

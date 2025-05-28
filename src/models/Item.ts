import * as mongoose from "mongoose";
import { model } from "mongoose";

const itemSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  cover: { type: String, required: true },
  price: { type: Number, required: true },
  veg: { type: Boolean, required: true },
  status: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const Item = model("items", itemSchema);

export default Item;

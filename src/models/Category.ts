import * as mongoose from "mongoose";
import { model } from "mongoose";

const categorySchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const Category = model("categories", categorySchema);

export default Category;

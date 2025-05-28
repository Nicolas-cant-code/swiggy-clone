import * as mongoose from "mongoose";
import { model } from "mongoose";

const restaurantSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  city_id: { type: mongoose.Types.ObjectId, ref: "cities", required: true },
  name: { type: String, required: true },
  // short_name: { type: String, required: true },
  description: { type: String },
  location: { type: Object, required: true },
  cuisines: { type: Array, required: true },
  cover: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  delivery_time: { type: Number, required: true },
  isClosed: { type: Boolean, required: true, default: false },
  status: { type: String, required: true, default: "active" },
  rating: { type: Number, required: true, default: 0 },
  totalRatings: { type: Number, required: true, default: 0 },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const Restaurant = model("resteraunts", restaurantSchema);

export default Restaurant;

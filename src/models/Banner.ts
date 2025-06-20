import * as mongoose from "mongoose";
import { model } from "mongoose";

const bannerSchema = new mongoose.Schema({
  banner: { type: String, required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "restaurants" },
  status: { type: Boolean, required: true, default: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const banner = model("banners", bannerSchema);

export default banner;

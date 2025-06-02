import * as mongoose from "mongoose";
import { model } from "mongoose";

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  address: { type: String, required: true },
  title: { type: String, required: true },
  house: { type: String, required: true },
  Lat: { type: String, required: true },
  Lng: { type: String, required: true },
  landmark: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const address = model("addressses", addressSchema);

export default address;

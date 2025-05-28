import * as mongoose from "mongoose";
import { model } from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  Lat: { type: Number, required: true },
  Lng: { type: Number, required: true },
  status: { type: String, required: true, default: "active" },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const City = model("cities", citySchema);

export default City;

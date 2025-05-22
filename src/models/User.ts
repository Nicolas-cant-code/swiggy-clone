import * as mongoose from "mongoose";
import { model } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  email_verification: { type: Boolean, required: true, default: false },
  verification_token: { type: Number, required: true },
  verification_token_time: { type: Date, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  phone: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const User = model("users", userSchema);

export default User;

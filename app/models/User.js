// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // will store the hash
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.User) {
    delete mongoose.models.User;
  }
  if (mongoose.connection?.models?.User) {
    delete mongoose.connection.models.User;
  }
}

export default mongoose.models.User || mongoose.model("User", userSchema);
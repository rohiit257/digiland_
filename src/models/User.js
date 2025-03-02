import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  aadharNumber: { type: String, required: true, unique: true, minlength: 12, maxlength: 12 },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  address: { type: String, required: true },
});

// ✅ Use `mongoose.models.UserProfile` to avoid overwriting model
const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", UserSchema);

export default UserProfile;

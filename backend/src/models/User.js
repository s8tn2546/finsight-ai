import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    password: { type: String }, // Hashed for normal auth
    wallet: { type: String, unique: true, sparse: true }, // Ethereum wallet address
    nonce: { type: String, default: () => Math.floor(Math.random() * 1000000).toString() }, // SIWE nonce
    name: { type: String },
    profileImage: { type: String },
    riskTolerance: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    preferredCurrency: { type: String, default: "USD" },
    completedLessons: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

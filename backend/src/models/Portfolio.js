import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema(
  {
    symbol: String,
    quantity: Number,
    buyPrice: Number,
  },
  { _id: false }
);

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    holdings: [HoldingSchema],
  },
  { timestamps: true }
);

export const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

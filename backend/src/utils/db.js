import mongoose from "mongoose";

let connected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return;
  }
  if (connected) return;
  try {
    await mongoose.connect(uri, { dbName: "finsightai" });
    connected = true;
    console.log("mongodb connected");
  } catch (e) {
    console.error("mongodb connection failed, using in-memory store");
  }
}

export function mongoAvailable() {
  return connected;
}

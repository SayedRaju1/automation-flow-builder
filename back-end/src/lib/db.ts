import mongoose from "mongoose";

function getMongoDbUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  return uri;
}

export async function connectDb(): Promise<void> {
  await mongoose.connect(getMongoDbUri());
  console.log("MongoDB connected");
}

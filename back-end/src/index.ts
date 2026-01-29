import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb } from "./lib/db";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

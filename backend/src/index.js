import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();

// ↑ Naikkan limit body parser supaya base64 image besar pun diterima
app.use(express.json({ 
  limit: "10mb" 
}));
app.use(express.urlencoded({ 
  limit: "10mb", 
  extended: true 
}));

app.use(cookieParser());

// CORS: ijinkan front-end (5173) kirim cookie
app.use(cors({
  origin:      "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
  connectDB();
});

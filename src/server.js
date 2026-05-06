import express from "express";
import { CLIENT_URL, PORT } from "../config/env.js";
import authRoutes from "./routes/auth.route.js";
import contactsRoutes from "./routes/contacts.route.js";
import chatsRoutes from "./routes/chats.route.js";

import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import { json } from "stream/consumers";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { initSocketServer } from "./lib/socket.js";
import messagesRouter from "./routes/message.route.js";
import { RateProtection } from "./middleware/rateLimiting.middleware.js";
const app = express();
const server = http.createServer(app);
initSocketServer(server, CLIENT_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
 app.use(RateProtection)

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/messages", messagesRouter);


app.use(errorHandler);
server.listen(PORT, (req, res) => {
  console.log("Server running on port " + PORT);
  connectDB();
});

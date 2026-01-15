import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin:"*",
    methods: ["GET", "POST"]
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins their personal room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server (IMPORTANT: server.listen, NOT app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running with sockets on port ${PORT}`);
});

// Export io to use in controllers
export { io };

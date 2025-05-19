import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import UserRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();

//Middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true,limit: '10mb' }));
app.use(cors());

//sockey.io

const server = http.createServer(app);

export const io = new Server(server,{
    cors:{origin: "*"}
})

//storing online users
export const userSocketMap = {}

//Socket.io connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId; 

  console.log("user connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


//Api end Points
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", UserRouter);
app.use("/api/messages", messageRouter);

//connect database
await connectDB();



const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

server.listen(PORT, () => console.log("server started", PORT));

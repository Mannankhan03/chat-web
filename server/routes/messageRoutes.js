import express from "express";
import { ProtectRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUserForsidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageContainer.js";

const messageRouter = express.Router();

messageRouter.get("/users", ProtectRoute, getUserForsidebar);
messageRouter.get("/:id", ProtectRoute, getMessages);
messageRouter.put("/mark/:id", ProtectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", ProtectRoute, sendMessage);

export default messageRouter;

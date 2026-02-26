import { Router } from "express";
import { sendChat, getAllSessions, getSessionMessages, deleteSession, deleteChats } from "../controllers/chat-controller.js";
import { verifyToken } from "../utils/token-managers.js";

const chatRoutes = Router();

chatRoutes.post("/new", verifyToken, sendChat);
chatRoutes.get("/all-sessions", verifyToken, getAllSessions);
chatRoutes.get("/session/:id", verifyToken, getSessionMessages);
chatRoutes.delete("/session/:id", verifyToken, deleteSession);
chatRoutes.delete("/delete-all", verifyToken, deleteChats);

// Backward Compatibility
chatRoutes.get("/all-chats", verifyToken, getAllSessions);
chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;

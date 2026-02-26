import axios from "axios";

/**
 * Axios instance with backend base URL
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL || "http://localhost:5555/api/v1",
  withCredentials: true, // 🔥 REQUIRED for auth
});

/* ================= USER AUTH ================= */

// LOGIN
export const loginUser = async (email, password) => {
  const res = await api.post("/user/login", { email, password });
  return res.data;
};

// SIGNUP
export const signupUser = async (name, email, password) => {
  const res = await api.post("/user/signup", { name, email, password });
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await api.get("/user/logout");
  return res.data;
};

// CHECK AUTH STATUS
export const checkAuthStatus = async () => {
  const res = await api.get("/user/auth-status");
  return res.data;
};

/* ================= CHAT ================= */

// ✅ SEND MESSAGE (FIXED)
export const sendChatRequest = async (message, sessionId = null) => {
  const res = await api.post("/chat/new", { message, sessionId });
  return res.data; // { answer: "AI text", sessionId: "...", sessionTitle: "..." }
};

// GET LIST OF SESSIONS
export const getAllSessions = async () => {
  const res = await api.get("/chat/all-sessions");
  return res.data; // { sessions: [{id, title, createdAt}] }
};

// GET MESSAGES FOR A SESSION
export const getSessionMessages = async (id) => {
  const res = await api.get(`/chat/session/${id}`);
  return res.data; // { messages: [...] }
};

// DELETE INDIVIDUAL SESSION
export const deleteSessionById = async (id) => {
  const res = await api.delete(`/chat/session/${id}`);
  return res.data;
};

// GET ALL CHATS (LEGACY/LIST OF SESSIONS)
export const getUserChats = async () => {
  const res = await api.get("/chat/all-sessions");
  return res.data;
};

// DELETE ALL CHATS
export const deleteChats = async () => {
  const res = await api.delete("/chat/delete-all");
  return res.data;
};

/* ================= NOTES ================= */

// UPLOAD NOTES
export const uploadNotes = async (pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const res = await api.post("/notes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

import userModel from "../models/user-model.js";
import aiClient from "../utils/aiClient.js";

// Send message to AI and save to a specific session
export const sendChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    let session;
    if (sessionId) {
      session = user.sessions.find(s => s.id === sessionId);
    }

    // If no sessionId or session not found, create a new one
    if (!session) {
      session = {
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: []
      };
      user.sessions.push(session);
      // Re-get the session object after pushing to get its generated ID
      session = user.sessions[user.sessions.length - 1];
    }

    // 1. Save user message
    session.messages.push({ role: "user", content: message });

    // 2. Call AI
    const aiResponse = await aiClient.post("/chat", { message });
    const assistantContent = aiResponse.data.answer;

    // 3. Save assistant message
    session.messages.push({ role: "assistant", content: assistantContent });
    await user.save();

    return res.status(200).json({
      answer: assistantContent,
      sessionId: session.id, // Return sessionId so frontend can keep track
      sessionTitle: session.title
    });
  } catch (error) {
    console.error("Chat controller error:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "AI failed to respond",
    });
  }
};

// Get list of all sessions (titles and IDs)
export const getAllSessions = async (req, res) => {
  try {
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const sessionsMetadata = user.sessions.map(s => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt
    })).sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({ message: "OK", sessions: sessionsMetadata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Get all messages for a specific session
export const getSessionMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const session = user.sessions.find(s => s.id === id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    return res.status(200).json({ message: "OK", messages: session.messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Delete a specific session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    user.sessions = user.sessions.filter(s => s.id !== id);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Delete all chat history (legacy support)
export const deleteChats = async (req, res) => {
  try {
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    user.sessions = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

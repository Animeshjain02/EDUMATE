import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Container, Avatar, Menu, MenuItem, Divider, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Chatitem from "../components/chat/Chatitem";
import { IoMdSend, IoMdTrash, IoMdAdd, IoMdMenu } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { sendChatRequest, getAllSessions, getSessionMessages, deleteSessionById, deleteChats } from "../helpers/api-communicator";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import NavigationalLink from "../components/shared/NavigationalLink";
import { MdKeyboardArrowDown, MdLogout } from "react-icons/md";

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem("currentSessionId") || null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);
  const chatContainerRef = useRef(null);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    await auth.logout();
    toast.success("Logout success");
    navigate("/login");
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data?.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useLayoutEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;
    fetchSessions();
    const savedId = localStorage.getItem("currentSessionId");
    if (savedId) {
      loadSession(savedId);
    }
  }, [auth?.isLoggedIn, auth?.user]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth?.user, navigate]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    } else {
      localStorage.removeItem("currentSessionId");
    }
  }, [currentSessionId]);

  const loadSession = async (id) => {
    try {
      setCurrentSessionId(id);
      const data = await getSessionMessages(id);
      setChatMessages(data?.messages || []);
    } catch (error) {
      toast.error("Failed to load conversation");
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setChatMessages([]);
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteSessionById(id);
      toast.success("Conversation deleted");
      if (currentSessionId === id) handleNewChat();
      fetchSessions();
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    inputRef.current.value = "";
    setChatMessages((prev) => [...prev, { role: "user", content }]);

    try {
      const res = await sendChatRequest(content, currentSessionId);
      if (res?.answer) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
        if (!currentSessionId) {
          setCurrentSessionId(res.sessionId);
          fetchSessions();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("AI failed to respond");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%", background: "#080b14", color: "white", overflow: "hidden" }}>
      {/* Sidebar - ChatGPT Style */}
      <Box
        sx={{
          display: { xs: isSidebarOpen ? "flex" : "none", md: "flex" },
          flexDirection: "column",
          width: isSidebarOpen ? "320px" : "0px",
          minWidth: isSidebarOpen ? "320px" : "0px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          pt: 4,
          transition: "all 0.3s ease",
          overflow: "hidden"
        }}
      >
        <Box sx={{ px: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--accent-primary)", letterSpacing: "0.5px", mb: 4, fontSize: "1.2rem", textTransform: "uppercase" }}>
            CHAT HISTORY
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<IoMdAdd />}
            onClick={handleNewChat}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.1)",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",
              background: "rgba(255, 255, 255, 0.03)",
              "&:hover": { background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.3)" }
            }}
          >
            New Chat
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 700, px: 2, mb: 2, display: "block", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.6 }}>
            Past Conversations
          </Typography>
          <List>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                disablePadding
                sx={{ mb: 0.5 }}
                secondaryAction={
                  <IconButton edge="end" onClick={(e) => handleDeleteSession(session.id, e)} sx={{ color: "rgba(255,255,255,0.2)", "&:hover": { color: "#ff4d4d" } }}>
                    <IoMdTrash size={18} />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => loadSession(session.id)}
                  selected={currentSessionId === session.id}
                  sx={{
                    borderRadius: "10px",
                    px: 2,
                    bgcolor: currentSessionId === session.id ? "rgba(255, 255, 255, 0.05)" : "transparent",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px", color: currentSessionId === session.id ? "var(--accent-primary)" : "var(--text-secondary)" }}>
                    <FiMessageSquare size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={session.title}
                    primaryTypographyProps={{ fontSize: "0.9rem", noWrap: true, fontWeight: currentSessionId === session.id ? 700 : 500, color: currentSessionId === session.id ? "white" : "var(--text-secondary)" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: "#0a0d1a" }}>
        {/* Top Navbar */}
        <Box sx={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", px: 4, borderBottom: "1px solid rgba(255, 255, 255, 0.05)", bgcolor: "rgba(255, 255, 255, 0.01)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: "white" }}>
              <IoMdMenu />
            </IconButton>
            <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "white", letterSpacing: "-0.5px" }}>
              AI CHAT ASSISTANT
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <NavigationalLink to="/notes" text="Notes Summarizer" className="nav-link" style={{ fontSize: "0.95rem", opacity: 0.8 }} />
            <Box onClick={handleProfileClick} sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", bgcolor: "rgba(255, 255, 255, 0.03)", px: 1.5, py: 0.8, borderRadius: "50px", border: "1px solid rgba(255, 255, 255, 0.1)", transition: "all 0.2s", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" } }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: "#cbd5e1", color: "black", fontSize: "0.8rem", fontWeight: 700 }}>
                {auth.user?.name ? auth.user.name[0].toUpperCase() : "U"}
              </Avatar>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>{auth.user?.name}</Typography>
              <MdKeyboardArrowDown size={18} />
            </Box>
          </Box>
        </Box>

        {/* Profile Dropdown */}
        <Menu anchorEl={anchorEl} open={openProfile} onClose={handleProfileClose} PaperProps={{ sx: { mt: 1.5, width: "240px", background: "#161c2d", color: "white", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" } }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" sx={{ color: "var(--accent-primary)", fontWeight: 700 }}>Authenticated</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}>{auth.user?.email}</Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />
          <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: "#ff4d4d", gap: 1.5, "&:hover": { bgcolor: "rgba(255, 77, 77, 0.05)" } }}>
            <MdLogout size={20} />
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Sign Out</Typography>
          </MenuItem>
        </Menu>

        {/* Content Area */}
        <Container maxWidth="md" sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", pt: 6, pb: 4 }}>
          <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", pr: 2, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.05)", borderRadius: "10px" } }}>
            {chatMessages.length === 0 ? (
              <Box sx={{ m: "auto", textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: "white" }}>How can I help you today?</Typography>
                <Typography sx={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Start a new conversation or select one from history.</Typography>
              </Box>
            ) : chatMessages.map((chat, idx) => <Chatitem key={idx} content={chat.content} role={chat.role} />)}
          </Box>

          <Box sx={{ mt: 3, p: 1, display: "flex", alignItems: "center", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px" }}>
            <input ref={inputRef} placeholder="Ask anything..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "1rem", padding: "12px 20px" }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            <IconButton onClick={handleSubmit} sx={{ m: 0.5, background: "rgba(255, 255, 255, 0.1)", color: "white", "&:hover": { background: "rgba(255, 255, 255, 0.2)" } }}>
              <IoMdSend />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Chat;

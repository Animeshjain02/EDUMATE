import React, { useState, useRef } from "react";
import { Box, Typography, Container, CircularProgress, Grid, Divider, Menu, MenuItem, Avatar } from "@mui/material";
import axios from "axios";
import { IoMdCloudUpload, IoMdDocument, IoMdListBox, IoMdCheckmarkCircle } from "react-icons/io";
import { MdKeyboardArrowDown, MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationalLink from "../components/shared/NavigationalLink";
import toast from "react-hot-toast";

const Notes = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(() => localStorage.getItem("notes_summary") || "");
  const [quiz, setQuiz] = useState(() => {
    const saved = localStorage.getItem("notes_quiz");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);
  const fileInputRef = useRef(null);
  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (summary) {
      localStorage.setItem("notes_summary", summary);
    } else {
      localStorage.removeItem("notes_summary");
    }
  }, [summary]);

  React.useEffect(() => {
    if (quiz.length > 0) {
      localStorage.setItem("notes_quiz", JSON.stringify(quiz));
    } else {
      localStorage.removeItem("notes_quiz");
    }
  }, [quiz]);

  const handleReset = () => {
    setFile(null);
    setSummary("");
    setQuiz([]);
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    await auth.logout();
    toast.success("Logout success");
    navigate("/login");
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5555/api/v1/notes/upload",
        formData,
        { withCredentials: true }
      );
      setSummary(res.data.summary);
      setQuiz(res.data.quiz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#080b14", color: "white", overflowX: "hidden" }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 6, md: 8 },
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          bgcolor: "rgba(255, 255, 255, 0.01)",
          boxSizing: "border-box"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "white",
              letterSpacing: "-0.5px"
            }}
          >
            NOTES SUMMARIZER
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <NavigationalLink
            to="/chat"
            text="Chat"
            className="nav-link"
            style={{ fontSize: "0.95rem", opacity: 0.8 }}
          />
          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              px: 1.5,
              py: 0.8,
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" }
            }}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: "#cbd5e1", color: "black", fontSize: "0.8rem", fontWeight: 700 }}>
              {auth.user?.name ? auth.user.name[0].toUpperCase() : "U"}
            </Avatar>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {auth.user?.name}
            </Typography>
            <MdKeyboardArrowDown size={18} />
          </Box>
        </Box>
      </Box>

      {/* Profile Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={openProfile}
        onClose={handleProfileClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: "240px",
            background: "#161c2d",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
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

      <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: "center", color: "white" }}>
          Notes Summarizer
        </Typography>
        <Typography sx={{ color: "var(--text-secondary)", mb: 6, textAlign: "center" }}>
          Upload your PDF study material and let AI do the work.
        </Typography>

        {/* Upload Zone */}
        {(!summary && quiz.length === 0) && (
          <Box
            className="glass-panel"
            sx={{
              p: 4,
              mb: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderStyle: "dashed",
              borderWidth: "2px",
              borderColor: file ? "var(--accent-primary)" : "var(--glass-border)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": { borderColor: "var(--accent-primary)", background: "rgba(0, 255, 252, 0.03)" }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <IoMdCloudUpload size={64} color={file ? "var(--accent-primary)" : "var(--text-secondary)"} />
            <Typography variant="h6" sx={{ mt: 2, color: file ? "white" : "var(--text-secondary)" }}>
              {file ? file.name : "Click to select a PDF file"}
            </Typography>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && !loading && !summary && (
              <button
                className="btn-primary"
                style={{ marginTop: "24px" }}
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              >
                Start AI Processing
              </button>
            )}
          </Box>
        )}

        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: "var(--accent-primary)" }} />
            <Typography sx={{ mt: 2, color: "var(--text-secondary)" }}>AI is analyzing your notes...</Typography>
          </Box>
        )}

        {/* Results */}
        {(summary || quiz.length > 0) && (
          <Box className="fade-in">
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <button className="btn-primary" onClick={handleReset}>
                Upload Another PDF
              </button>
            </Box>
            <Grid container spacing={4}>
              {/* Summary Section */}
              {summary && (
                <Grid item xs={12}>
                  <Box className="glass-panel" sx={{ p: 4, height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                      <IoMdDocument size={28} color="var(--accent-primary)" />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>Smart Summary</Typography>
                    </Box>
                    <Divider sx={{ mb: 3, borderColor: "var(--glass-border)" }} />
                    <Typography sx={{ color: "var(--text-primary)", lineHeight: 1.8, fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
                      {summary}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Quiz Section */}
              {quiz.length > 0 && (
                <Grid item xs={12}>
                  <Box className="glass-panel" sx={{ p: 4, bgcolor: "rgba(255,255,255,0.02)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                      <IoMdListBox size={28} color="var(--accent-secondary)" />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>Quick Quiz</Typography>
                    </Box>
                    <Divider sx={{ mb: 3, borderColor: "var(--glass-border)" }} />
                    {quiz.map((q, idx) => (
                      <Box key={idx} sx={{ mb: 4 }}>
                        <Typography sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                          {idx + 1}. {q.question}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {q.options.map((opt, i) => (
                            <Box
                              key={i}
                              sx={{
                                p: 1.5,
                                px: 2,
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid var(--glass-border)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5
                              }}
                            >
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-secondary)", opacity: 0.5 }} />
                              <Typography variant="body2">{opt}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Notes;

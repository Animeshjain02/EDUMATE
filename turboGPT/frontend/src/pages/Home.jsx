import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TypingAnim from "../components/typer/TypingAnim";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/shared/Logo";

const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleGetStarted = () => {
    if (auth?.isLoggedIn) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  return (
    <Box width="100%" height="100%" sx={{ overflow: "hidden", position: "relative" }}>
      {/* Top Left Logo */}
      <Box sx={{ position: "absolute", top: { xs: 16, md: 24 }, left: { xs: 16, md: 32 }, zIndex: 10 }}>
        <Logo />
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            textAlign: "center",
            pt: { xs: 10, md: 15 },
          }}
          className="fade-in"
        >



          <Box sx={{ mb: 4, minHeight: "60px" }}>
            <TypingAnim />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "var(--text-secondary)",
              maxWidth: "600px",
              mb: 6,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Join thousands of students using our advanced AI to summarize notes,
            generate quizzes, and master any subject in minutes.
          </Typography>

          <button
            className="btn-primary"
            onClick={handleGetStarted}
            style={{ fontSize: "1.1rem", padding: "16px 48px" }}
          >
            Get Started
          </button>

          {/* Feature Preview */}
          <Box
            sx={{
              mt: 10,
              width: "100%",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: "100%",
                background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
                zIndex: -1,
                opacity: 0.3,
              }
            }}
          >
            <Box
              component="img"
              src="chat.png"
              alt="Dashboard Preview"
              sx={{
                width: "100%",
                maxWidth: "1000px",
                borderRadius: "24px",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
                backdropFilter: "blur(20px)",
              }}
            />
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ my: 15 }}>
          {[
            { title: "Smart Chat", desc: "Interact with Gemini-powered AI for instant answers to complex academic questions." },
            { title: "PDF Summary", desc: "Upload any document and get a concise, structured summary in seconds." },
            { title: "Quiz Master", desc: "Test your knowledge with AI-generated quizzes tailored to your study material." },
          ].map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box
                className="glass-panel"
                sx={{
                  p: 4,
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid var(--glass-border)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "var(--accent-secondary)",
                    background: "rgba(255, 255, 255, 0.04)"
                  }
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: "white" }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: "var(--text-secondary)" }}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

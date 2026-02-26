import React, { useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import CustomisedInput from "../components/shared/CustomisedInput";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      toast.loading("Creating Account", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Account Created Successfully", { id: "signup" });
      navigate("/chat");
    } catch (error) {
      console.log("signup error ::", error);
      toast.error(error.response?.data?.message || "Signup failed", {
        id: "signup",
      });
    }
  };

  useEffect(() => {
    if (auth?.isLoggedIn) {
      navigate("/chat");
    }
  }, [auth, navigate]);

  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "var(--bg-primary)",
        pt: 10,
      }}
    >
      <Container maxWidth="sm" className="fade-in">
        <Box
          className="glass-panel"
          sx={{
            p: { xs: 4, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid var(--glass-border)",
            background: "rgba(255, 255, 255, 0.01)",
          }}
        >
          {/* Restored Box Logo */}
          <Box
            sx={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#0a1128",
              fontSize: "2rem",
              boxShadow: "0 0 25px var(--accent-glow)",
              mb: 4,
            }}
          >
            E
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            Create Account
          </Typography>
          <Typography
            sx={{
              color: "var(--text-secondary)",
              mb: 5,
              fontSize: "1.05rem",
            }}
          >
            Join and start your AI-powered journey
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
          >
            <CustomisedInput label="Full Name" type="text" name="name" />
            <CustomisedInput label="Email Address" type="email" name="email" />
            <CustomisedInput label="Password" type="password" name="password" />

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: "30px",
                fontSize: "1rem",
                padding: "14px",
                borderRadius: "10px"
              }}
            >
              Get Started
            </button>
          </form>

          <Typography sx={{ mt: 5, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
              Sign In
            </Link>
          </Typography>

          <Link
            to="/"
            style={{
              marginTop: "20px",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.3s"
            }}
            onMouseOver={(e) => e.target.style.opacity = 1}
            onMouseOut={(e) => e.target.style.opacity = 0.6}
          >
            ← Back to Home
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;

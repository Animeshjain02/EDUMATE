import { Typography, Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { MdShowChart } from "react-icons/md";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <MdShowChart
          className="pulse"
          style={{
            fontSize: "2.2rem",
            color: "var(--accent-primary)",
            filter: "drop-shadow(0 0 8px var(--accent-glow))"
          }}
        />
        <Typography
          sx={{
            display: { md: "block", sm: "none", xs: "none" },
            ml: 1,
            fontWeight: 800,
            fontSize: "1.6rem",
            letterSpacing: "1px",
            color: "white",
            fontFamily: "Outfit, sans-serif",
            textTransform: "uppercase",
          }}
        >
          EDU<span style={{ color: "var(--accent-primary)" }}>MATE</span>
        </Typography>
      </Link>
    </Box>
  );
};

export default Logo;

import React, { useState } from "react";
import { AppBar, Toolbar, Box, Typography, Menu, MenuItem, Avatar, Switch, Divider } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import NavigationalLink from "./shared/NavigationalLink";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown, MdOutlineModeNight, MdLanguage, MdLogout } from "react-icons/md";

const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await auth.logout();
    toast.success("Logout success");
    navigate("/login");
  };

  const isHome = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (!auth?.isLoggedIn && (isHome || isAuthPage)) {
    return null;
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pt: 3, position: "fixed", width: "100%", zIndex: 1100 }}>
      <AppBar
        className="glass-panel"
        sx={{
          bgcolor: "transparent",
          position: "static",
          boxShadow: "none",
          maxWidth: "1200px",
          mx: "auto",
          borderRadius: "50px",
          px: 2,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "70px",
          }}
        >
          {/* Navigation - Left Side */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {auth?.isLoggedIn && (
              location.pathname === "/notes" ? (
                <NavigationalLink
                  to="/chat"
                  text="Chat"
                  className="nav-link"
                />
              ) : location.pathname === "/chat" ? (
                <NavigationalLink
                  to="/notes"
                  text="Notes Summarizer"
                  className="nav-link"
                />
              ) : (
                <NavigationalLink
                  to="/notes"
                  text="Notes Summarizer"
                  className="nav-link"
                />
              )
            )}
          </Box>

          {/* Profile Section - Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 3 },
            }}
          >
            {auth?.isLoggedIn && !isHome ? (
              <>
                {/* Profile Section with Dropdown */}
                <Box
                  onClick={handleClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    border: "1.5px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    px: 1.5,
                    py: 0.5,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "var(--accent-primary)",
                      color: "black",
                      fontWeight: 700,
                      fontSize: "0.9rem"
                    }}
                  >
                    {auth.user?.name ? auth.user.name[0].toUpperCase() : "U"}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>
                      {auth.user?.name}
                    </Typography>
                  </Box>
                  <MdKeyboardArrowDown color="white" size={18} />
                </Box>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 2,
                      width: "280px",
                      background: "#161c2d",
                      color: "white",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 24,
                        width: 10,
                        height: 10,
                        bgcolor: "#161c2d",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                        borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 3, py: 2 }}>
                    <Typography sx={{ color: "#3165d4", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", mb: 0.5 }}>
                      Authenticated
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {auth.user?.email}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

                  <MenuItem sx={{ py: 1.5, px: 3, gap: 2 }}>
                    <MdOutlineModeNight size={22} color="#4b89ff" />
                    <Typography sx={{ flex: 1, fontWeight: 500 }}>Appearance: Dark</Typography>
                    <Switch defaultChecked size="small" />
                  </MenuItem>

                  <MenuItem sx={{ py: 1.5, px: 3, gap: 2 }}>
                    <MdLanguage size={22} color="#4b89ff" />
                    <Typography sx={{ flex: 1, fontWeight: 500 }}>Language: English</Typography>
                    <MdKeyboardArrowDown size={18} />
                  </MenuItem>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1.5, px: 3, gap: 2, color: "#ff4d4d", "&:hover": { background: "rgba(255, 77, 77, 0.05)" } }}
                  >
                    <MdLogout size={22} />
                    <Typography sx={{ fontWeight: 600 }}>Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Hide all header buttons on Home and Auth pages for unauthenticated users */
              !isHome && !isAuthPage && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                  style={{ padding: "8px 24px", fontSize: "0.9rem" }}
                >
                  Login
                </button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;

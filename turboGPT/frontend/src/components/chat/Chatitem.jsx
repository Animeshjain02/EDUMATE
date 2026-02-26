import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeBlocksFromString(message = "") {
  if (typeof message !== "string" || !message.includes("```")) return null;
  return message.split("```");
}

function isCodeBlock(str = "") {
  return ["=", ";", "{", "}", "[", "]", "//"].some(sym => str.includes(sym));
}

const Chatitem = ({ content = "", role = "user" }) => {
  const auth = useAuth();
  const messageBlocks = extractCodeBlocksFromString(content);
  const isAssistant = role === "assistant";

  const name = auth?.user?.name || "User";
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAssistant ? "flex-start" : "flex-end",
        gap: 1,
        mb: 3,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isAssistant ? "row" : "row-reverse",
          alignItems: "flex-end",
          gap: 2,
          maxWidth: "85%",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: isAssistant ? "var(--bg-secondary)" : "var(--accent-primary)",
            color: isAssistant ? "white" : "black",
            fontSize: "0.8rem",
            fontWeight: 700,
            border: isAssistant ? "1px solid var(--glass-border)" : "none",
          }}
        >
          {isAssistant ? (
            <img src="openai.png" alt="AI" width="20px" style={{ filter: "invert(100%)" }} />
          ) : (
            initials
          )}
        </Avatar>

        <Box
          className="glass-panel"
          sx={{
            p: 2,
            px: 3,
            borderRadius: isAssistant ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
            bgcolor: isAssistant ? "rgba(255, 255, 255, 0.05)" : "var(--accent-primary)",
            color: isAssistant ? "white" : "black",
            border: "none",
            boxShadow: isAssistant ? "none" : "0 4px 15px var(--accent-glow)",
          }}
        >
          {messageBlocks ? (
            messageBlocks.map((block, index) =>
              isCodeBlock(block) ? (
                <SyntaxHighlighter
                  key={index}
                  style={coldarkDark}
                  language="javascript"
                  customStyle={{
                    borderRadius: "12px",
                    margin: "12px 0",
                    fontSize: "0.9rem",
                    background: "#0d1117",
                  }}
                >
                  {block}
                </SyntaxHighlighter>
              ) : (
                <Typography key={index} sx={{ fontSize: "1rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {block}
                </Typography>
              )
            )
          ) : (
            <Typography sx={{ fontSize: "1rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chatitem;

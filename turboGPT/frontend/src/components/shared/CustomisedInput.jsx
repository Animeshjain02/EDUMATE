import React from "react";
import { TextField } from "@mui/material";

const CustomisedInput = (props) => {
  return (
    <TextField
      margin="normal"
      autoComplete="off"
      name={props.name}
      label={props.label}
      type={props.type}
      fullWidth
      required
      InputLabelProps={{
        style: { color: "var(--text-secondary)", fontWeight: 500 },
      }}
      InputProps={{
        style: {
          borderRadius: 12,
          fontSize: "1.1rem",
          color: "white",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--glass-border)",
          transition: "all 0.3s ease",
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "1px solid var(--accent-primary)" },
        },
        "& label.Mui-focused": { color: "var(--accent-primary)" },
        mb: 2,
      }}
    />
  );
};

export default CustomisedInput;

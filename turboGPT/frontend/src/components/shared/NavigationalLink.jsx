import React from "react";
import { Link } from "react-router-dom";

const NavigationalLink = (props) => {
  return (
    <Link
      onClick={props.onClick}
      className={props.className || "nav-link"}
      to={props.to}
      style={{ color: props.textColor, ...props.style }}
    >
      {props.text}
    </Link>
  );
};

export default NavigationalLink;

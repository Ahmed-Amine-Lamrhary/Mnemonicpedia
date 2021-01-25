import React from "react";
import { Link } from "react-router-dom";

function Button({ text, type = "button", to, onClick, ...rest }) {
  if (to)
    return (
      <Link style={style.button} to={to} {...rest}>
        {text}
      </Link>
    );

  return (
    <button style={style.button} type={type} onClick={onClick} {...rest}>
      {text}
    </button>
  );
}

const style = {
  button: {
    cursor: "pointer",
    border: "0",
    fontSize: "15px",
    fontWeight: "400",
    borderRadius: "3px",
    padding: "12px 20px",
    fontFamily: "inherit",
    boxShadow: "0 3px 10px #eaf2fd",
    transition: "all 0.2s ease-in-out",
    textDecoration: "none",
  },
};

export default Button;

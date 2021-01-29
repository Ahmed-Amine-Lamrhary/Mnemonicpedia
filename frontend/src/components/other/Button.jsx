import React from "react";
import { Link } from "react-router-dom";
import colors from "../../utility/colors";

function Button({
  children,
  type = "button",
  to,
  bgColor = "primary",
  addStyle,
  ...rest
}) {
  if (to)
    return (
      <Link
        style={{
          ...style.button,
          ...addStyle,
          backgroundColor: colors.hasOwnProperty(bgColor)
            ? colors[bgColor]
            : colors.primary,
          color:
            bgColor === "light" || bgColor === "white"
              ? colors.primary
              : colors.white,
        }}
        to={to}
        {...rest}
      >
        {children}
      </Link>
    );

  return (
    <button
      style={{
        ...style.button,
        ...addStyle,
        backgroundColor: colors.hasOwnProperty(bgColor)
          ? colors[bgColor]
          : colors.primary,
        color:
          bgColor === "light" || bgColor === "white"
            ? colors.primary
            : colors.white,
      }}
      type={type}
      {...rest}
    >
      {children}
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
    display: "inline-block",
  },
};

export default Button;

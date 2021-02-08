import React from "react";
import { Link } from "react-router-dom";
import colors from "../../utility/colors";
import "../../assets/css/button.css";

function Button({
  children,
  type = "button",
  to,
  bgColor = "primary",
  addStyle,
  ...rest
}) {
  const btnStyle = {
    ...addStyle,
    backgroundColor: colors.hasOwnProperty(bgColor)
      ? colors[bgColor]
      : colors.primary,
    color:
      bgColor === "light" || bgColor === "white"
        ? colors.primary
        : colors.white,
  };

  if (to)
    return (
      <Link style={btnStyle} className="button" to={to} {...rest}>
        {children}
      </Link>
    );

  return (
    <button style={btnStyle} className="button" type={type} {...rest}>
      {children}
    </button>
  );
}

export default Button;

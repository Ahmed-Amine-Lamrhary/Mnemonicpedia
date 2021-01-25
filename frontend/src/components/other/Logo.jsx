import React from "react";
import { Link } from "react-router-dom";
import config from "../../utility/config";

function Logo(props) {
  return (
    <div className="logo">
      <Link style={style.link} to="/">
        {config.brand}
      </Link>
    </div>
  );
}

const style = {
  link: {
    fontSize: "17px",
    color: "black",
    display: "inline-block",
    textDecoration: "none",
    textTransform: "uppercase",
    fontWeight: "700",
  },
};

export default Logo;

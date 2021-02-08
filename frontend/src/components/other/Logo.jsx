import React from "react";
import { Link } from "react-router-dom";
import config from "../../utility/config";
import "../../assets/css/logo.css";

function Logo(props) {
  return (
    <div className="logo">
      <Link to="/">{config.brand}</Link>
    </div>
  );
}

export default Logo;

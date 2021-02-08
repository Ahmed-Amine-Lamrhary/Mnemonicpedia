import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/css/formnavigation.css";

function FormNavigation({ links }) {
  return (
    <div className="form-nav">
      {links.map((link, index) => (
        <NavLink className="form-link" key={index} to={link.to}>
          {link.text}
        </NavLink>
      ))}
    </div>
  );
}

export default FormNavigation;

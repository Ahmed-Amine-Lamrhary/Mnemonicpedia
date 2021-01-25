import React from "react";
import { NavLink } from "react-router-dom";

function Navs({ navs }) {
  return (
    <ul className="nav nav-pills mb-4">
      {navs.map((nav, index) => (
        <li key={index} className="nav-item">
          {!nav.onClick ? (
            <NavLink to={nav.to} className="nav-link">
              {nav.text}
            </NavLink>
          ) : (
            <a href="#" className="nav-link" onClick={nav.onClick}>
              {nav.text}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default Navs;

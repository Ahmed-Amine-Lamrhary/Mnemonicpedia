import React from "react";
import { NavLink } from "react-router-dom";

function FormNavigation({ links }) {
  return (
    <div style={style.container} className="form-nav">
      {links.map((link, index) => (
        <NavLink style={style.link} key={index} to={link.to}>
          {link.text}
        </NavLink>
      ))}
    </div>
  );
}

const style = {
  container: {
    display: "flex",
    WebkitBoxPack: "space-between",
    MozBoxPack: "space-between",
    MsFlexPack: "space-between",
    WebkitJustifyContent: "space-between",
    justifyContent: "space-between",
    WebkitBoxAlign: "center",
    MozBoxAlign: "center",
    MsFlexAlign: "center",
    WebkitAlignItems: "center",
    alignItems: "center",
    padding: "20px 0",
    marginBottom: "30px",
  },
  link: {
    fontSize: "20px",
    color: "black",
    fontWeight: "800",
    position: "relative",
    letterSpacing: "0.5px",
    textDecoration: "none",
  },
  activeLink: {},
};

export default FormNavigation;

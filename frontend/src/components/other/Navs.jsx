import React from "react";
import Button from "./Button";

function Navs({ navs }) {
  return (
    <ul className="nav nav-pills mb-4">
      {navs.map((nav, index) => (
        <li key={index} className="nav-item">
          {!nav.onClick ? (
            <Button to={nav.to} bgColor="white">
              {nav.text}
            </Button>
          ) : (
            <Button onClick={nav.onClick} bgColor="white">
              {nav.text}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default Navs;

import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

function Dropdown({ content: Content, list }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <li className="dropdown nav-item">
      <a
        className="dropdown-toggle nav-link"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Content />
      </a>
      {isVisible && (
        <ul className="dropdown-menu dropdown-navbar">
          {list.map((l, index) => (
            <li className="nav-link">
              <Link
                key={index}
                to={l.route}
                onClick={() => setIsVisible(false)}
                className="nav-item dropdown-item"
              >
                {l.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default Dropdown;

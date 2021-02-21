import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar(props) {
  return (
    <div className="sidebar">
      <button className="show-sidebar">
        <i className="ri-arrow-right-s-line"></i>
      </button>

      <div className="top">
        <h1>Mnemonicpedia</h1>
        <ul>
          <li>
            <NavLink to="/admin/users">
              <i className="ri-user-3-line"></i> Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/posts">
              <i className="ri-file-3-line"></i> Posts
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories">
              <i className="ri-price-tag-line"></i> Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/shared-images">
              <i className="ri-image-line"></i> Shared Images
            </NavLink>
          </li>
        </ul>
      </div>

      <ul className="bottom">
        <li>
          <NavLink to="/terms-and-conditions">Terms and conditions</NavLink>
        </li>
        <li>
          <NavLink to="/privacy-policy">Privacy policy</NavLink>
        </li>
        <li>
          <NavLink to="/social-media">Social network</NavLink>
        </li>
        <li>
          <NavLink to="/about">About us</NavLink>
        </li>
        <li>
          <NavLink to="/logout">Logout</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

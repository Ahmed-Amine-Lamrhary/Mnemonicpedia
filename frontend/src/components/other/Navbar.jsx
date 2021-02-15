import React from "react";
import { getMyId } from "../../api/me";
import Button from "./Button";
import Logo from "./Logo";

function Navbar(props) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-absolute navbar-transparent">
        <div className="container">
          <div className="navbar-wrapper">
            <Logo />
          </div>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto">
              {!getMyId() && (
                <>
                  <li className="input-group ml-2">
                    <Button to="/login">Login</Button>
                  </li>
                  <li className="input-group ml-2">
                    <Button to="/register">Register</Button>
                  </li>
                </>
              )}

              {getMyId() && (
                <>
                  <li className="input-group">
                    <Button to="/submit" bgColor="light">
                      Submit
                    </Button>
                  </li>
                  <Button to="/me" bgColor="white">
                    <i className="ri-user-3-line"></i>
                  </Button>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

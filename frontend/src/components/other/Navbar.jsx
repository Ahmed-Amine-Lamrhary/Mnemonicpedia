import React from "react";
import { getUser } from "../../utility/user";
import Button from "./Button";
import Logo from "./Logo";

function Navbar(props) {
  const user = getUser();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-absolute navbar-transparent">
        <div className="container">
          <div className="navbar-wrapper">
            <Logo />
          </div>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto">
              {!user && (
                <>
                  <li className="input-group ml-2">
                    <Button to="/login">Login</Button>
                  </li>
                  <li className="input-group ml-2">
                    <Button to="/register">Register</Button>
                  </li>
                </>
              )}

              {user && (
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

import React from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../utility/user";
import Button from "./Button";
import Dropdown from "./Dropdown";
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
              <li className="input-group">
                <Button text="Submit" to="/submit" className="btn-primary" />
              </li>

              {!user && (
                <>
                  <li className="input-group ml-2">
                    <Button text="Login" to="/login" className="btn-primary" />
                  </li>
                  <li className="input-group ml-2">
                    <Button
                      text="Register"
                      to="/register"
                      className="btn-primary"
                    />
                  </li>
                </>
              )}

              {user && <Link to="/user">user</Link>}

              {/* {user && (
                <Dropdown
                  content={() => (
                    <>
                      <div className="photo">
                        <img
                          src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png"
                          alt="profile"
                          width="30"
                        />
                      </div>
                      <b className="caret d-none d-lg-block d-xl-block"></b>
                    </>
                  )}
                  list={[
                    {
                      route: "/dashboard/profile",
                      text: "Profile",
                    },
                  ]}
                />
              )} */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

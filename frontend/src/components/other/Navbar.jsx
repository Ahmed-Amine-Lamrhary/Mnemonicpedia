import React from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../utility/user";
import Dropdown from "./Dropdown";
import Logo from "./Logo";
import SearchBox from "./SearchBox";

function Navbar(props) {
  const user = getUser();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-absolute navbar-transparent">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <Logo />
          </div>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto">
              <SearchBox
                content={() => (
                  <li className="search-bar input-group">
                    <button className="btn btn-link">
                      <i className="tim-icons icon-zoom-split"></i>
                      <span className="d-lg-none d-md-block">Search</span>
                    </button>
                  </li>
                )}
              />

              {!user && (
                <>
                  <li className="input-group">
                    <Link to="/login" className="btn btn-sm btn-primary">
                      Login
                    </Link>
                  </li>
                  <li className="input-group">
                    <Link to="/register" className="btn btn-sm btn-success">
                      Register
                    </Link>
                  </li>
                </>
              )}

              {user && (
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
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

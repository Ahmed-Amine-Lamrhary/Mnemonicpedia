import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Sidebar from "./Sidebar";
import Users from "./Users";
import Posts from "./Posts";
import Categories from "./Categories";
import sharedImages from "./sharedImages";
import "./dashboard.css";

function Dashboard(props) {
  return (
    <div className="main-dashboard">
      <Sidebar />
      <div className="content">
        <div className="header">
          <ul className="types">
            <li>
              <Link to="/">All</Link>
            </li>
            <li>
              <Link to="/">
                Active <span>0</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                Suspended <span>0</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                Flagged <span>0</span>
              </Link>
            </li>
          </ul>
          <form>
            <input type="search" placeholder="Search" autocomplete="off" />
            <button>
              <i className="ri-search-line"></i>
            </button>
          </form>
        </div>

        <Switch>
          <Route path="/admin/users" component={Users} />
          <Route path="/admin/posts" component={Posts} />
          <Route path="/admin/categories" component={Categories} />
          <Route path="/admin/shared-images" component={sharedImages} />

          {/* <Route path="/terms-and-conditions" component={} />
        <Route path="/privacy-policy" component={} />
        <Route path="/social-media" component={} />
        <Route path="/about" component={} /> */}
        </Switch>
      </div>
    </div>
  );
}

export default Dashboard;

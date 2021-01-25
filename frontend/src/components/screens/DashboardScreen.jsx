import React, { useState } from "react";
import axios from "axios";
import { getUser } from "../../utility/user";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import config from "../../utility/config";
import { setToken, getToken } from "../../utility/auth";
import MessageBox from "../other/MessageBox";
import { Link, Route, Switch } from "react-router-dom";
import Logo from "../other/Logo";

function Dashboard({ logout, history }) {
  const { fullname, username, email } = getUser();
  const [isMessageBox, setIsMessageBox] = useState(false);

  const [newFullname, setNewFullname] = useState(fullname);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  axios.defaults.headers.common["x-auth-token"] = getToken();

  const updateUser = async () => {
    const { data: token } = await axios.put(`${config.api}/user`, {
      fullname: newFullname,
      username: newUsername,
      email: newEmail,
      password,
      password2,
    });

    if (token) setToken(token);
  };

  const deleteUser = async () => {
    await axios.delete(`${config.api}/user`, {
      email,
    });
    logout(history, "Your account has been deleted successfully");
  };

  const updateForm = () => (
    <>
      <h1>Hello {getUser().fullname}</h1>
      <Form onSubmit={updateUser}>
        <FormGroup
          type="text"
          label="Full Name"
          value={newFullname}
          onChange={(e) => setNewFullname(e.target.value)}
        />
        <FormGroup
          type="text"
          label="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <FormGroup
          type="email"
          label="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <FormGroup
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormGroup
          type="password"
          label="Repeat Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Update
        </button>
        <button
          onClick={() => setIsMessageBox(true)}
          className="btn ml-2 btn-danger"
          type="button"
        >
          Delete Account
        </button>
      </Form>
    </>
  );

  const sidebar = () => (
    <div className="list-group">
      <Logo />
      <Link to="/dashboard" className="list-group-item list-group-item-action">
        <i className="tim-icons icon-chart-pie-36"></i> Dashboard
      </Link>
      <Link
        to="/dashboard/profile"
        className="list-group-item list-group-item-action"
      >
        <i className="tim-icons icon-chart-pie-36"></i> Profile
      </Link>
      <Link onClick={logout} className="list-group-item list-group-item-action">
        <i className="tim-icons icon-chart-pie-36"></i> Logout
      </Link>
    </div>
  );

  return (
    <div className="container-fluid">
      <MessageBox
        visible={isMessageBox}
        onClose={() => setIsMessageBox(false)}
        title="Are you sure you want to delete your account?"
        buttons={[
          {
            text: "Keep My Account",
            colorClass: "primary",
            onClick: () => setIsMessageBox(false),
          },
          {
            text: "Delete My Account",
            colorClass: "danger",
            onClick: () => deleteUser(),
          },
        ]}
      />

      <div className="row">
        <div className="col-md-2">
          <div className="sidebar">{sidebar()}</div>
        </div>

        <div className="col-md-10">
          <Switch>
            <Route path="/dashboard/profile" render={() => updateForm()} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

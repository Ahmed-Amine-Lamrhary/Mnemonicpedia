import React, { useState } from "react";
import axios from "axios";
import { getUser } from "../../utility/user";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import config from "../../utility/config";
import { setToken, getToken } from "../../utility/auth";
import MessageBox from "../other/MessageBox";
import { NavLink, Route, Switch } from "react-router-dom";
import Button from "../other/Button";
import Navs from "../other/Navs";

function User({ logout, history }) {
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

  const getPosts = () => (
    <>
      <h1>Posts of {getUser().fullname}</h1>
    </>
  );

  const updateForm = () => (
    <>
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
        <Button text="Update" type="submit" className="btn-primary" />
        <Button
          text="Delete Account"
          className="ml-2 btn-danger"
          onClick={() => setIsMessageBox(true)}
        />
      </Form>
    </>
  );

  const list = () => (
    <Navs
      navs={[
        {
          to: "/user/posts",
          text: "Posts",
        },
        {
          to: "/user/settings",
          text: "Settings",
        },
        {
          text: "Logout",
          onClick: logout,
        },
      ]}
    />
  );

  return (
    <div className="container">
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

      <div className="user-list">{list()}</div>

      <Switch>
        <Route path="/user/posts" render={() => getPosts()} />
        <Route path="/user/settings" render={() => updateForm()} />
      </Switch>
    </div>
  );
}

export default User;

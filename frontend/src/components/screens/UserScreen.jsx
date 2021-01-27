import React, { useState } from "react";
import axios from "axios";
import { getUser } from "../../utility/user";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import config from "../../utility/config";
import { setToken, getToken } from "../../utility/auth";
import MessageBox from "../other/MessageBox";
import { Route, Switch } from "react-router-dom";
import Button from "../other/Button";
import Navs from "../other/Navs";

function User({ logout, history, match }) {
  const { _id, fullname, username, email } = getUser();
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
        <Button type="submit">Update</Button>
        <Button
          className="ml-2"
          bgColor="danger"
          onClick={() => setIsMessageBox(true)}
        >
          Delete Account
        </Button>
      </Form>
    </>
  );

  const getPosts = () => (
    <>
      <h1>Posts</h1>
    </>
  );

  const navs = () => {
    if (match.path === "/me")
      return [
        {
          to: "/me/posts",
          text: "Posts",
        },
        {
          to: "/me/settings",
          text: "Settings",
        },
        {
          to: `/user/${_id}`,
          text: "View as visitor",
        },
        {
          text: "Logout",
          onClick: logout,
        },
      ];

    return [
      {
        to: `${match.url}/posts`,
        text: "Posts",
      },
      {
        to: `/report-user/${_id}`,
        text: "Report User",
      },
    ];
  };

  return (
    <div className="container">
      {match.path === "/me" && (
        <MessageBox
          visible={isMessageBox}
          onClose={() => setIsMessageBox(false)}
          title="Are you sure you want to delete your account?"
          buttons={[
            {
              text: "Keep My Account",
              bgColor: "primary",
              onClick: () => setIsMessageBox(false),
            },
            {
              text: "Delete My Account",
              bgColor: "danger",
              onClick: () => deleteUser(),
            },
          ]}
        />
      )}

      <Navs navs={navs()} />

      <Switch>
        <Route path="/me/posts" render={() => getPosts()} />
        <Route path="/user/:id/posts" render={() => getPosts()} />
        <Route path="/me/settings" render={() => updateForm()} />
      </Switch>
    </div>
  );
}

export default User;

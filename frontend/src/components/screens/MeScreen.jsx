import React, { useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import MessageBox from "../other/MessageBox";
import { Route, Switch } from "react-router-dom";
import Button from "../other/Button";
import Navs from "../other/Navs";
import { getMe, updateMe, deleteMe, logout } from "../../api/me";

function MeScreen({ history, match }) {
  const { _id, fullname, username, email } = getMe() || {};
  const [isMessageBox, setIsMessageBox] = useState(false);

  const [newFullname, setNewFullname] = useState(fullname);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleUpdate = async () => {
    try {
      await updateMe(
        {
          fullname: newFullname,
          username: newUsername,
          email: newEmail,
          password: newPassword,
          password2: newPassword2,
        },
        history
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMe({ email }, history);
    } catch (error) {
      console.error(error);
    }
  };

  const updateForm = () => (
    <>
      <Form onSubmit={handleUpdate}>
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
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <FormGroup
          type="password"
          label="Repeat Password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
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
        onClick: () => logout(history),
      },
    ];
  };

  return (
    <div className="container">
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
            onClick: () => handleDelete(),
          },
        ]}
      />
      <Navs navs={navs()} />

      <Switch>
        <Route path="/me/posts" render={() => getPosts()} />
        <Route path="/me/settings" render={() => updateForm()} />
      </Switch>
    </div>
  );
}

export default MeScreen;

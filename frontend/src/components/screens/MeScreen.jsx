import React, { useEffect, useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import MessageBox from "../other/MessageBox";
import { Route, Switch } from "react-router-dom";
import Button from "../other/Button";
import Navs from "../other/Navs";
import { getMe, updateMe, deleteMe, getMyId } from "../../api/me";
import { logout } from "../../api/auth";
import Mnemonics from "../other/Mnemonics";

function MeScreen({ history }) {
  const _id = getMyId();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");

  const [isMessageBox, setIsMessageBox] = useState(false);
  const [newFullname, setNewFullname] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleGetMe = async () => {
    try {
      const { fullname, username, email } = await getMe();
      setFullname(fullname);
      setUsername(username);
      setNewFullname(fullname);
      setNewUsername(username);
      setNewEmail(email);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  const handleUpdate = async () => {
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
  };

  const handleDelete = async () => {
    try {
      await deleteMe(history);
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

  const handleLogout = async () => {
    try {
      await logout(history);
    } catch (error) {
      console.error(error);
    }
  };

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
        onClick: () => handleLogout(),
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

      <div>
        <h1>{fullname}</h1>
        <h5>@{username}</h5>
      </div>

      <Switch>
        <Route
          path="/me/posts"
          render={() => <Mnemonics query={{ author: _id }} />}
        />
        <Route path="/me/settings" render={() => updateForm()} />
      </Switch>
    </div>
  );
}

export default MeScreen;

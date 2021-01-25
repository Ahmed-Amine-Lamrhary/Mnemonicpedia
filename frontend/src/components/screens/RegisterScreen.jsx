import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import config from "../../utility/config";
import Button from "../other/Button";
import FormNavigation from "../forms/FormNavigation";

function Register({ history, location }) {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async () => {
    const {
      data: { user },
    } = await axios.post(`${config.api}/user`, {
      fullname,
      username,
      email,
      password,
      password2,
    });

    // redirect to login
    history.push({
      pathname: "/login",
      state: {
        message: {
          type: "success",
          value: `You are registered succussfully ${user.fullname}. Please login.`,
        },
      },
    });
  };

  return (
    <div className="container">
      <FormNavigation
        links={[
          { to: "/register", text: "Register" },
          { to: "/login", text: "Log in" },
        ]}
      />

      <Form onSubmit={handleRegister} location={location}>
        <FormGroup
          type="text"
          label="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <FormGroup
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormGroup
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button text="Register" type="submit" className="btn-primary" />
      </Form>
    </div>
  );
}

export default Register;

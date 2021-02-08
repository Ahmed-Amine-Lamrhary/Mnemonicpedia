import React, { useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import Button from "../other/Button";
import FormNavigation from "../forms/FormNavigation";
import { register } from "../../api/auth";

function Register({ history, location }) {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async () => {
    await register({ fullname, username, email, password, password2 }, history);
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
        <Button type="submit">Register</Button>
      </Form>
    </div>
  );
}

export default Register;

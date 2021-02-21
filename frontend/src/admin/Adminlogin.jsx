import React, { useState } from "react";
import Form from "../components/forms/Form";
import FormCheck from "../components/forms/FormCheck";
import FormGroup from "../components/forms/FormGroup";
import Button from "../components/other/Button";

function Adminlogin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const handleLogin = () => {};

  return (
    <div className="container">
      <Form onSubmit={handleLogin}>
        <FormGroup
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormGroup
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormCheck
          label="Keep me logged in"
          id="keepLogin"
          checked={keepLogin}
          onChange={() => setKeepLogin(!keepLogin)}
        />

        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}

export default Adminlogin;

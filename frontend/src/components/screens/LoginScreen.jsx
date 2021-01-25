import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import { login } from "../../utility/auth";
import config from "../../utility/config";

function Login({ history, location }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const handleLogin = async (e) => {
    const { data: token } = await axios.post(`${config.api}/auth`, {
      email,
      password,
      keepLogin,
    });

    // save user's token and redirect to dashboard
    login(token, history, "/dashboard");
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <Form onSubmit={handleLogin} location={location}>
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

        <div className="form-check mb-4">
          <input
            type="checkbox"
            checked={keepLogin}
            onChange={() => setKeepLogin(!keepLogin)}
            className="form-check-input"
            id="keepLogin"
          />
          <label className="form-check-label" htmlFor="keepLogin">
            Keep me logged in
          </label>
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
        <div className="mt-3">
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;

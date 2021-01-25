import React from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utility/auth";

function Home(props) {
  const publicContent = () => {
    return (
      <>
        <p>Please login or register</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
      </>
    );
  };

  const privateContent = () => {
    return (
      <>
        <Link to="/dashboard" className="btn btn-primary">
          Go to dashboard
        </Link>
      </>
    );
  };

  return (
    <div>
      <h1>Hello to our website</h1>
      {!getToken() ? publicContent() : privateContent()}
    </div>
  );
}

export default Home;

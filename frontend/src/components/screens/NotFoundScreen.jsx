import React from "react";
import Button from "../other/Button";

function NotFound(props) {
  return (
    <div className="not-found container">
      <h1>Page not found</h1>
      <p>We're sorry, we couldn't find the page you requested.</p>
      <Button to="/">Go to home page</Button>
    </div>
  );
}

export default NotFound;

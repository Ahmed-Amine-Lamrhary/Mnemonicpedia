import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getToken, logout } from "../../utility/auth";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!getToken()) return <Redirect to="/login" />;
        return <Component {...props} logout={() => logout(props.history)} />;
      }}
    />
  );
}

export default PrivateRoute;

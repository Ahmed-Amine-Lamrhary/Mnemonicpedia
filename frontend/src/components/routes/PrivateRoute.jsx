import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getMe } from "../../api/me";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!getMe()) return <Redirect to="/login" />;
        return <Component {...props} />;
      }}
    />
  );
}

export default PrivateRoute;

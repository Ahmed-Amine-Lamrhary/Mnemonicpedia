import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getMe } from "../../api/me";

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (getMe()) return <Redirect to="/me" />;
        return <Component {...props} />;
      }}
    />
  );
}

export default PublicRoute;

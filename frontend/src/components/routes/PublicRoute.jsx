import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getMyId } from "../../api/me";

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (getMyId()) return <Redirect to="/me" />;
        return <Component {...props} />;
      }}
    />
  );
}

export default PublicRoute;

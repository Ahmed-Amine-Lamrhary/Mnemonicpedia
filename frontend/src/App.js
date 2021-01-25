import { useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { isStillAuthenticated } from "./utility/auth";
import Dashboard from "./components/screens/DashboardScreen";
import Home from "./components/screens/HomeScreen";
import Login from "./components/screens/LoginScreen";
import Register from "./components/screens/RegisterScreen";
import NotFound from "./components/screens/NotFoundScreen";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import Navbar from "./components/other/Navbar";

function App({ history }) {
  useEffect(() => {
    isStillAuthenticated(history);
  });

  return (
    <>
      <Navbar />
      <div className="content">
        <Switch>
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" component={Home} exact />
          <Redirect to="/notFound" />
        </Switch>
      </div>
    </>
  );
}

export default withRouter(App);

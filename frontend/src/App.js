import { useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { isStillAuthenticated } from "./utility/auth";
import User from "./components/screens/UserScreen";
import Home from "./components/screens/HomeScreen";
import Login from "./components/screens/LoginScreen";
import Register from "./components/screens/RegisterScreen";
import MnemonicScreen from "./components/screens/MnemonicScreen";
import NotFound from "./components/screens/NotFoundScreen";
import Submit from "./components/screens/Submit";
import ReportUser from "./components/screens/ReportUser";
import ReportMnemonic from "./components/screens/ReportMnemonic";
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
          <Route path="/mnemonic-:id" component={MnemonicScreen} />
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/register" component={Register} />
          <PrivateRoute path="/user" component={User} />
          <PrivateRoute path="/submit" component={Submit} />
          <PrivateRoute path="/report-user-:id" component={ReportUser} />
          <PrivateRoute
            path="/report-mnemonic-:id"
            component={ReportMnemonic}
          />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" component={Home} exact />
          <Redirect to="/notFound" />
        </Switch>
      </div>
    </>
  );
}

export default withRouter(App);

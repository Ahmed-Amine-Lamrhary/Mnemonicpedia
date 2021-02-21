import { useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import User from "./components/screens/UserScreen";
import Home from "./components/screens/HomeScreen";
import Login from "./components/screens/LoginScreen";
import ActivateAccount from "./components/screens/ActivateAccount";
import Register from "./components/screens/RegisterScreen";
import MnemonicScreen from "./components/screens/MnemonicScreen";
import NotFound from "./components/screens/NotFoundScreen";
import Submit from "./components/screens/Submit";
import ReportUser from "./components/screens/ReportUser";
import ReportMnemonic from "./components/screens/ReportMnemonic";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import Navbar from "./components/other/Navbar";
import axios from "axios";
import MeScreen from "./components/screens/MeScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Adminlogin from "./admin/Adminlogin";
import Dashboard from "./admin/Dashboard";

function App({ history, location }) {
  const toastConfig = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    draggable: false,
  };

  const axiosSuccess = (response) => {
    if (response.data.message)
      toast.success(response.data.message, toastConfig);

    return response;
  };
  const axiosError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("meId");
        history.push("/login");
      }
      toast.error(error.response.data.error, toastConfig);
    } else toast.error("Network error", toastConfig);

    return Promise.reject(error);
  };

  axios.defaults.withCredentials = true;
  axios.interceptors.response.use(axiosSuccess, axiosError);

  useEffect(() => {
    if (location && location.state) {
      const { message } = location.state;
      if (message) toast.info(message.value, toastConfig);
    }
  }, [location]);

  return (
    <>
      <ToastContainer />

      {/* <Navbar /> */}

      <div className="contents">
        <Switch>
          <PublicRoute path="/admin" component={Dashboard} />

          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/activate" component={ActivateAccount} />
          <PublicRoute path="/register" component={Register} />
          <PrivateRoute path="/me" component={MeScreen} />
          <Route path="/user/:id" component={User} />
          <PrivateRoute path="/submit" component={Submit} />
          <PrivateRoute path="/edit/:id" component={Submit} />
          <PrivateRoute path="/report-user/:id" component={ReportUser} />
          <PrivateRoute
            path="/report-mnemonic/:id"
            component={ReportMnemonic}
          />
          <Route path="/:name/:id" component={MnemonicScreen} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" component={Home} exact />
          <Redirect to="/notFound" />
        </Switch>
      </div>
    </>
  );
}

export default withRouter(App);

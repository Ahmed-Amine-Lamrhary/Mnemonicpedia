import axios from "axios";
import config from "../utility/config";

const resource = "auth";

const login = async ({ email, password, keepLogin }, history, prevLocation) => {
  const {
    data: { activated, meId },
  } = await axios.post(`${config.api}/auth/login`, {
    email,
    password,
    keepLogin,
  });

  if (activated === false) return false;

  localStorage.setItem("meId", meId);

  // redirect to dashboard
  if (!prevLocation) return history.replace("/");
  history.replace(prevLocation.pathname);
};

const activate = async ({ email, secretNumber }, history) => {
  const {
    data: { user },
  } = await axios.post(`${config.api}/auth/activate`, {
    email,
    secretNumber,
  });

  // redirect to login
  if (user) {
    history.push({
      pathname: "/login",
      state: {
        message: {
          type: "success",
          value: "Your account has been activated. Please login",
        },
      },
    });
  }
};

const register = async (
  { fullname, username, email, password, password2 },
  history
) => {
  const {
    data: { user },
  } = await axios.post(`${config.api}/${resource}/register`, {
    fullname,
    username,
    email,
    password,
    password2,
  });

  // redirect to login
  history.push({
    pathname: "/login",
    state: {
      message: {
        type: "success",
        value: `An activation email has been sent to : ${user.email}. Please check your inbox.`,
      },
    },
  });
};

const logout = async (history, message) => {
  await axios.post(`${config.api}/auth/logout`);

  localStorage.removeItem("meId");
  history.push("/login", {
    message: {
      type: "error",
      value: message,
    },
  });
};

export { login, activate, register, logout };

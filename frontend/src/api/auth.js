import axios from "axios";
import config from "../utility/config";
import { getMe } from "./me";

const resource = "auth";
const key = "token";

const login = async ({ email, password, keepLogin }, history, prevLocation) => {
  const { data: token } = await axios.post(`${config.api}/auth/login`, {
    email,
    password,
    keepLogin,
  });

  // save user's token and redirect to dashboard
  localStorage.setItem(key, token);
  if (!prevLocation) return history.replace("/");
  history.replace(prevLocation.pathname);
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
        value: `You are registered succussfully ${user.fullname}. Please login.`,
      },
    },
  });
};

const logout = (history, message) => {
  localStorage.removeItem(key);
  history.push("/login", {
    message: {
      type: "error",
      value: message,
    },
  });
};

const getToken = () => {
  return localStorage.getItem(key);
};

const isStillAuthenticated = (history) => {
  if (!getMe()) return;
  const { exp } = getMe();
  if (!exp) return;
  const now = new Date().getTime() / 1000;
  if (now >= exp) logout(history, "Your session is expired");
};

export { login, register, logout, isStillAuthenticated, getToken };

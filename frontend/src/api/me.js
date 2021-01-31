import axios from "axios";
import config from "../utility/config";
import { decode } from "jsonwebtoken";

const resource = "me";
const key = "token";

const getMe = () => {
  if (getToken()) return decode(getToken());
  return null;
};

const deleteMe = async ({ email }, history) => {
  await axios.delete(`${config.api}/${resource}`, {
    email,
  });
  logout(history, "Your account has been deleted successfully");
};

const updateMe = async ({ fullname, username, email, password, password2 }) => {
  const { data: token } = await axios.put(`${config.api}/${resource}`, {
    fullname,
    username,
    email,
    password,
    password2,
  });

  if (token) localStorage.setItem(key, token);
};

const login = async ({ email, password, keepLogin }, history) => {
  const { data: token } = await axios.post(`${config.api}/auth`, {
    email,
    password,
    keepLogin,
  });

  // save user's token and redirect to dashboard
  localStorage.setItem(key, token);
  history.replace("/me");
};

const register = async (
  { fullname, username, email, password, password2 },
  history
) => {
  const {
    data: { user },
  } = await axios.post(`${config.api}/${resource}`, {
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

// Other functions

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

export {
  getMe,
  login,
  register,
  logout,
  isStillAuthenticated,
  updateMe,
  deleteMe,
  getToken,
};

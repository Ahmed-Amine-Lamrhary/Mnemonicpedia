import axios from "axios";
import config from "../utility/config";

const resource = "auth";

const login = async ({ email, password, keepLogin }, history, prevLocation) => {
  const {
    data: { meId },
  } = await axios.post(`${config.api}/auth/login`, {
    email,
    password,
    keepLogin,
  });

  localStorage.setItem("meId", meId);

  // redirect to dashboard
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

export { login, register, logout };

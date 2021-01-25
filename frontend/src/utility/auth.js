import { getUser } from "./user";

const key = "token";

const login = (token, history, to) => {
  setToken(token);
  history.replace(to);
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

const setToken = (token) => {
  localStorage.setItem(key, token);
};

const getToken = () => {
  return localStorage.getItem(key);
};

const isStillAuthenticated = (history) => {
  if (!getUser()) return;
  const { exp } = getUser();
  if (!exp) return;
  const now = new Date().getTime() / 1000;
  if (now >= exp) logout(history, "Your session is expired");
};

export { login, logout, setToken, getToken, isStillAuthenticated };

import axios from "axios";
import config from "../utility/config";
import { decode } from "jsonwebtoken";
import { getToken, logout } from "./auth";

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
  const {
    data: { token },
  } = await axios.put(`${config.api}/${resource}`, {
    fullname,
    username,
    email,
    password,
    password2,
  });

  if (token) localStorage.setItem(key, token);
};

export { getMe, updateMe, deleteMe };

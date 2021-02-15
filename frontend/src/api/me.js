import axios from "axios";
import config from "../utility/config";
import { logout } from "./auth";

const resource = "me";
const key = "token";

const getMyId = () => {
  return localStorage.getItem("meId");
};

const getMe = async () => {
  const { data } = await axios.get(`${config.api}/${resource}`);
  return data;
};

const deleteMe = async (history) => {
  await axios.delete(`${config.api}/${resource}`);
  await logout(history, "Your account has been deleted successfully");
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

export { getMe, updateMe, deleteMe, getMyId };

import axios from "axios";
import config from "../utility/config";

const resource = "user";

// User api
const getUser = async (_id) => {
  const response = await axios.get(`${config.api}/${resource}/${_id}`);
  return response;
};

const updateUser = () => {};

const deleteUser = () => {};

const reportUser = async ({ _id, title, content }) => {
  const response = await axios.post(`${config.api}/${resource}/report/${_id}`, {
    title,
    content,
  });
  return response;
};

export { getUser, updateUser, deleteUser, reportUser };

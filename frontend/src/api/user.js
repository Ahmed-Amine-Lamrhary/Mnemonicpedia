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

export { getUser, updateUser, deleteUser };

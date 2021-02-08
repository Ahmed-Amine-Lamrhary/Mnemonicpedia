import axios from "axios";
import config from "../utility/config";

const resource = "mnemonic";

const deleteMnemonic = async (_id) => {
  const response = await axios.delete(`${config.api}/${resource}/${_id}`);
  return response;
};

const getMnemonics = async (query) => {
  const { author = "", page = 1, search = "" } = query || {};
  const response = await axios.get(
    `${config.api}/${resource}?author=${author}&page=${page}&search=${search}`
  );
  return response;
};

const getMnemonic = async (_id) => {
  const response = await axios.get(`${config.api}/${resource}/${_id}`);
  return response;
};

const likeMnemonic = async (_id) => {
  // change in db
  const response = await axios.put(`${config.api}/${resource}/like/${_id}`);
  return response;
};

const createMnemonic = async ({ title, content, categories }) => {
  const response = await axios.post(`${config.api}/${resource}`, {
    title,
    content,
    categories,
  });
  return response;
};

const updateMnemonic = async ({ _id, title, content, categories }) => {
  const response = await axios.put(`${config.api}/${resource}/${_id}`, {
    title,
    content,
    categories,
  });
  return response;
};

export {
  deleteMnemonic,
  getMnemonics,
  getMnemonic,
  likeMnemonic,
  createMnemonic,
  updateMnemonic,
};

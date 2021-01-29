import axios from "axios";
import config from "../utility/config";

const resource = "mnemonic";

const deleteMnemonic = async (_id) => {
  const response = await axios.delete(`${config.api}/${resource}`, {
    data: {
      _id,
    },
  });
  return response;
};

const getMnemonics = async () => {
  const response = await axios.get(`${config.api}/${resource}`);
  return response;
};

const getMnemonic = async (_id) => {
  const response = await axios.get(`${config.api}/${resource}/${_id}`);
  return response;
};

const likeMnemonic = async (mnemonic) => {
  // change in db
  const response = await axios.put(`${config.api}/${resource}/like`, {
    data: { _id: mnemonic._id },
  });
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

export {
  deleteMnemonic,
  getMnemonics,
  getMnemonic,
  likeMnemonic,
  createMnemonic,
};

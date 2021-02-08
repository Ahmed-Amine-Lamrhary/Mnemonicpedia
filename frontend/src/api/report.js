import axios from "axios";
import config from "../utility/config";

const resource = "report";

const reportMnemonic = async ({ _id, title, content }) => {
  const response = await axios.post(
    `${config.api}/${resource}/mnemonic/${_id}`,
    {
      title,
      content,
    }
  );
  return response;
};

const reportUser = async ({ _id, title, content }) => {
  const response = await axios.post(`${config.api}/${resource}/user/${_id}`, {
    title,
    content,
  });
  return response;
};

export { reportMnemonic, reportUser };

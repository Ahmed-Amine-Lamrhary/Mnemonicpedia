import axios from "axios";
import config from "../utility/config";

const resource = "category";

const getCategories = async (query) => {
  const { text = "", exclude = [] } = query || {};

  const response = await axios.get(
    `${config.api}/${resource}?text=${text}&exclude=${JSON.stringify(exclude)}`
  );
  return response;
};

export { getCategories };

import axios from "axios";
import config from "../utility/config";

const resource = "category";

const getCategories = async () => {
  const response = await axios.get(`${config.api}/${resource}`);
  return response;
};

export { getCategories };

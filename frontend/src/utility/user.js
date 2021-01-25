import { getToken } from "./auth";
import { decode } from "jsonwebtoken";

const getUser = () => {
  if (getToken()) return decode(getToken());
  return null;
};

export { getUser };

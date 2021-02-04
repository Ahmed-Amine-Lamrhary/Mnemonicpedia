import React, { useEffect, useState } from "react";
import { getMe } from "../../api/me";
import { deleteMnemonic, getMnemonics, likeMnemonic } from "../../api/mnemonic";
import Button from "./Button";
import Mnemonic from "./Mnemonic";
import Nothing from "./Nothing";
import Loading from "./Loading";
import { useHistory, useLocation } from "react-router-dom";
import { parse } from "query-string";

function Mnemonics({ query }) {
  const [mnemonics, setMnemonics] = useState([]);
  const [page, setPage] = useState(1);
  const [reachEnd, setReachEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  const history = useHistory();
  const location = useLocation();

  const getAll = async (searchText = "") => {
    const filter = { text: searchText, page: 1 };
    const finalQuery = { ...query, ...filter };

    setReachEnd(false);
    setMnemonics([]);
    setLoading(true);

    try {
      const { data } = await getMnemonics(finalQuery);
      setMnemonics(data);
      if (data.length === 0) setReachEnd(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getLoaded = async () => {
    let { search: searchText } = parse(location.search) || {};

    const filter = { text: searchText, page: page + 1 };
    const finalQuery = { ...query, ...filter };

    setPage(page + 1);
    setLoading(true);

    try {
      const { data } = await getMnemonics(finalQuery);
      setMnemonics([...mnemonics, ...data]);
      if (data.length === 0) setReachEnd(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const user = getMe();

  const handleDelete = async (_id) => {
    try {
      await deleteMnemonic(_id);
      let newMnemonics = [...mnemonics];
      newMnemonics = newMnemonics.filter((mnemonic) => mnemonic._id !== _id);
      setMnemonics(newMnemonics);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const handleLike = async (mnemonic) => {
    // UI
    let newMnemonics = [...mnemonics];
    let mnemonicLikes = newMnemonics.find((m) => m._id === mnemonic._id).likes;

    if (!mnemonicLikes.includes(user._id)) mnemonicLikes.push(user._id);
    else
      newMnemonics.find(
        (m) => m._id === mnemonic._id
      ).likes = newMnemonics
        .find((m) => m._id === mnemonic._id)
        .likes.filter((l) => l !== user._id);

    setMnemonics(newMnemonics);

    try {
      // change in db
      await likeMnemonic(mnemonic);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let { search } = parse(location.search) || {};
    if (search) setValue(search);
    else search = "";

    getAll(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (value) history.push(`?search=${value}`);
    else history.push("/");

    getAll(value);
  };

  const revertSearch = () => {
    setValue("");
    history.push("/");

    getAll();
  };

  return (
    <>
      <form
        style={style.container}
        onSubmit={handleSearch}
        className="search-bar"
      >
        <input
          style={style.input}
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <i style={style.icon} className="ri-search-line"></i>
        {value && (
          <button onClick={revertSearch} type="button">
            close
          </button>
        )}
      </form>

      {mnemonics.length > 0 && (
        <>
          {mnemonics.map((mnemonic, index) => (
            <Mnemonic
              key={index}
              mnemonic={mnemonic}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))}
        </>
      )}
      {mnemonics.length === 0 && !loading && <Nothing model="mnemonic" />}

      <Loading loading={loading} />

      {!loading && !reachEnd && (
        <Button onClick={() => getLoaded()}>Load More</Button>
      )}
    </>
  );
}

const style = {
  container: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "10px",
    left: "16px",
    fontSize: "22px",
    opacity: "0.5",
  },
  input: {
    width: "100%",
    border: "0",
    background: "#f1f3f4",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: "500",
    color: "#707070",
    padding: "0 50px",
    borderRadius: "7px",
    transition: "all 0.2s ease-in-out",
    boxSizing: "border-box",
    height: "52px",
  },
  inputFocus: {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
    background: "white",
  },
};

export default Mnemonics;

import React, { useEffect, useState } from "react";
import { getMe } from "../../api/me";
import { deleteMnemonic, getMnemonics, likeMnemonic } from "../../api/mnemonic";
import Button from "./Button";
import Mnemonic from "./Mnemonic";
import Nothing from "./Nothing";
import Loading from "./Loading";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { parse, stringify } from "query-string";

function Mnemonics({ query }) {
  const [mnemonics, setMnemonics] = useState([]);
  const [reachEnd, setReachEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState({});

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const handleGet = async () => {
    const finalQuery = { ...query, ...filter };

    if (!filter.load) {
      setReachEnd(false);
      setMnemonics([]);
    }
    setLoading(true);

    try {
      const { data } = await getMnemonics(finalQuery);
      if (!filter.load) setMnemonics(data);
      else setMnemonics([...mnemonics, ...data]);

      if (data.length === 0) setReachEnd(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const { page: currentPage } = filter;
    const newFilter = { ...filter, page: currentPage + 1, load: true };
    setFilter(newFilter);

    history.push(
      `?${stringify({ search: newFilter.search, page: newFilter.page })}`
    );
  };

  const user = getMe();

  useEffect(() => {
    if ("search" in filter) handleGet();
  }, [filter]);

  useEffect(() => {
    let { search = "", page = 1 } = parse(location.search) || {};
    setFilter({ search, page: parseInt(page), load: false });

    if (search) setValue(search);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilter = { search: value, page: 1, load: false };
    if (value) {
      history.push(
        `?${stringify({ search: newFilter.search, page: newFilter.page })}`
      );
    } else history.push(match.url);

    setFilter(newFilter);
  };

  const revertSearch = () => {
    const newFilter = { search: "", page: 1, load: false };
    setValue("");
    history.push(match.url);

    setFilter(newFilter);
  };

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
            <Mnemonic key={index} mnemonic={mnemonic} onLike={handleLike} />
          ))}
        </>
      )}
      {mnemonics.length === 0 && !loading && <Nothing model="mnemonic" />}

      <Loading loading={loading} />

      {!loading && !reachEnd && (
        <div className="text-center mt-5 mb-5">
          <Button onClick={loadMore}>Load More</Button>
        </div>
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

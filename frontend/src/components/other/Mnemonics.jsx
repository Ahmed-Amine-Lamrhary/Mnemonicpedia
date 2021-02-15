import React, { useEffect, useState } from "react";
import { getMyId } from "../../api/me";
import { getMnemonics, likeMnemonic } from "../../api/mnemonic";
import Button from "./Button";
import Mnemonic from "./Mnemonic";
import Nothing from "./Nothing";
import Loading from "./Loading";
import { useHistory, useLocation } from "react-router-dom";
import { parse, stringify } from "query-string";
import generateUrl from "generate-url";
import "../../assets/css/searchform.css";

function Mnemonics({ query }) {
  const [mnemonics, setMnemonics] = useState([]);
  const [reachEnd, setReachEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState({});

  const history = useHistory();
  const location = useLocation();

  const handleGet = async () => {
    const finalQuery = { ...query, ...filter };
    const { search, load } = filter;

    if (!load) {
      setReachEnd(false);
      setMnemonics([]);
    }
    setLoading(true);

    try {
      const { data } = await getMnemonics(finalQuery);
      if (!load) setMnemonics(data);
      else setMnemonics([...mnemonics, ...data]);

      history.push(
        `?${stringify({
          search: search !== "" ? generateUrl(search) : undefined,
        })}`
      );

      if (data.length === 0) setReachEnd(true);
    } catch (error) {
      console.error(error);
      setReachEnd(true);
    } finally {
      setLoading(false);
      if (load) window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const loadMore = () => {
    const { page: currentPage } = filter;
    const newFilter = { ...filter, page: currentPage + 1, load: true };
    setFilter(newFilter);
  };

  const userId = getMyId();

  useEffect(() => {
    if ("search" in filter) {
      setValue(filter.search);
      handleGet();
    }
  }, [filter]);

  useEffect(() => {
    let { search = "", page = 1 } = parse(location.search) || {};
    setFilter({ search, page: parseInt(page), load: false });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilter = { search: value, page: 1, load: false };
    setFilter(newFilter);
  };

  const revertSearch = () => {
    const newFilter = { search: "", page: 1, load: false };
    setFilter(newFilter);
  };

  const handleLike = async (_id) => {
    // UI
    let newMnemonics = [...mnemonics];
    let mnemonicLikes = newMnemonics.find((m) => m._id === _id).likes;

    if (!mnemonicLikes.includes(userId)) mnemonicLikes.push(userId);
    else
      newMnemonics.find((m) => m._id === _id).likes = newMnemonics
        .find((m) => m._id === _id)
        .likes.filter((l) => l !== userId);

    setMnemonics(newMnemonics);

    try {
      // change in db
      await likeMnemonic(_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="searchform">
        <input
          className="input"
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <i className="icon ri-search-line"></i>
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

export default Mnemonics;

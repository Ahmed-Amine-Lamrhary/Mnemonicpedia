import React, { useEffect, useState } from "react";
import { getMe } from "../../api/me";
import { deleteMnemonic, getMnemonics, likeMnemonic } from "../../api/mnemonic";
import Button from "./Button";
import Mnemonic from "./Mnemonic";
import Nothing from "./Nothing";
import Loading from "./Loading";
import Search from "./Search";

function Mnemonics({ query }) {
  const [mnemonics, setMnemonics] = useState([]);
  const [page, setPage] = useState(1);
  const [reachEnd, setReachEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedText, setSearchedText] = useState("");

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

  const handleGet = async () => {
    const filter = { text: searchedText };
    const finalQuery = { ...query, ...filter, page };

    setLoading(true);
    try {
      const { data } = await getMnemonics(finalQuery);
      if (data.length === 0) return setReachEnd(true);

      const newMnemonics = [...mnemonics, ...data];
      setMnemonics(newMnemonics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (reachEnd) return;

    setPage(page + 1);
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
    handleGet();
  }, []);

  useEffect(() => {
    handleGet();
  }, [searchedText, page]);

  const handleSearch = async (searchText) => {
    setMnemonics([]);
    setPage(1);
    setReachEnd(false);
    setSearchedText(searchText);
  };

  return (
    <>
      <Search onSubmit={handleSearch} />

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

      {!loading && !reachEnd && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}

export default Mnemonics;

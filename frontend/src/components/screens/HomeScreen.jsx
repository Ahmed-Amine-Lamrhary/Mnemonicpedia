import React, { useEffect, useState } from "react";
import Mnemonic from "../other/Mnemonic";
import Search from "../other/Search";
import Nothing from "../other/Nothing";
import { deleteMnemonic, getMnemonics, likeMnemonic } from "../../api/mnemonic";
import { getMe } from "../../api/me";

function Home(props) {
  const [mnemonics, setMnemonics] = useState([]);
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
    try {
      const { data: mnemonics } = await getMnemonics();
      setMnemonics(mnemonics);
    } catch (error) {
      console.error(error);
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
    handleGet();
  }, []);

  return (
    <div className="container">
      <Search />

      {mnemonics.length > 0 ? (
        mnemonics.map((mnemonic, index) => (
          <Mnemonic
            key={index}
            mnemonic={mnemonic}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))
      ) : (
        <Nothing model="mnemonic" />
      )}
    </div>
  );
}

export default Home;

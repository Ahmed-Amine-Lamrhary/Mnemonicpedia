import React, { useEffect, useState } from "react";
import Mnemonic from "../other/Mnemonic";
import Search from "../other/Search";
import axios from "axios";
import config from "../../utility/config";
import Nothing from "../other/Nothing";
import { getToken } from "../../utility/auth";
import { getUser } from "../../utility/user";

function Home(props) {
  const [mnemonics, setMnemonics] = useState([]);
  const user = getUser();
  axios.defaults.headers.common["x-auth-token"] = getToken();

  const deleteMnemonic = async (_id) => {
    try {
      await axios.delete(`${config.api}/mnemonic`, {
        data: {
          _id,
        },
      });
      let newMnemonics = [...mnemonics];
      newMnemonics = newMnemonics.filter((mnemonic) => mnemonic._id !== _id);
      setMnemonics(newMnemonics);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const getMnemonics = async () => {
    try {
      const { data: mnemonics } = await axios.get(`${config.api}/mnemonic`);
      setMnemonics(mnemonics);
    } catch (error) {
      console.error(error);
    }
  };

  const likeMnemonic = async (mnemonic) => {
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
      await axios.put(`${config.api}/mnemonic/like`, {
        data: { _id: mnemonic._id },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMnemonics();
  }, []);

  return (
    <div className="container">
      <Search />

      {mnemonics.length > 0 ? (
        mnemonics.map((mnemonic, index) => (
          <Mnemonic
            key={index}
            mnemonic={mnemonic}
            onDelete={deleteMnemonic}
            onLike={likeMnemonic}
          />
        ))
      ) : (
        <Nothing model="mnemonic" />
      )}
    </div>
  );
}

export default Home;

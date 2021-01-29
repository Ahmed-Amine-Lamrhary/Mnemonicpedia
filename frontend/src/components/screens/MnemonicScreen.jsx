import React, { useEffect, useState } from "react";
import { getMnemonic } from "../../api/mnemonic";
import Mnemonic from "../other/Mnemonic";

function MnemonicScreen({ history, match }) {
  const [mnemonic, setMnemonic] = useState({});
  const { params } = match;

  const handleGetMnemonic = async () => {
    try {
      const { data: mnemonic } = await getMnemonic(params.id);
      setMnemonic(mnemonic);
    } catch (error) {
      console.error(error);
      history.push("/notFound");
    }
  };

  useEffect(() => {
    handleGetMnemonic();
  }, []);

  return <Mnemonic mnemonic={mnemonic} />;
}

export default MnemonicScreen;

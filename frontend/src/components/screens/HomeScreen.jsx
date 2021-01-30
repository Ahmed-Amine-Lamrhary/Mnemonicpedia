import React from "react";
import Search from "../other/Search";
import Mnemonics from "../other/Mnemonics";

function Home(props) {
  return (
    <div className="container">
      <Search />
      <Mnemonics />
    </div>
  );
}

export default Home;

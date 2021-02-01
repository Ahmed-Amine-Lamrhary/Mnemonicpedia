import React, { useState } from "react";
import { getMnemonics } from "../../api/mnemonic";

function Search(props) {
  const [value, setValue] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    const { data } = await getMnemonics({ text: value });
    console.log(data);
  };

  return (
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
    </form>
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

export default Search;

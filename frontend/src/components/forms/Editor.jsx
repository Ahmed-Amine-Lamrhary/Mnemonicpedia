import React from "react";

function Editor({ label, value, onChange }) {
  return (
    <textarea
      style={style.input}
      className="form-control"
      placeholder={label}
      onChange={onChange}
    >
      {value}
    </textarea>
  );
}

const style = {
  container: { position: "relative", marginBottom: "20px" },
  input: {
    borderRadius: "3px",
    border: "1px solid #d0d0d0",
    padding: "14px 12px",
    fontSize: "14px",
    transition: "all 0.1s ease-in-out",
    height: "auto",
    boxShadow: "none",
    minHeight: "200px",
  },
};

export default Editor;

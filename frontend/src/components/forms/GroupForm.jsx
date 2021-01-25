import React from "react";

function FormGroup({ type, label, value, onChange }) {
  return (
    <div style={style.container} className="form-group mb-3">
      <input
        style={style.input}
        className="form-control"
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
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
  },
};

export default FormGroup;

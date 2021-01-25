import React from "react";

function FormGroup({ type, label, value, onChange }) {
  return (
    <div className="form-group mb-3">
      <label>{label}</label>
      <input
        className="form-control"
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default FormGroup;

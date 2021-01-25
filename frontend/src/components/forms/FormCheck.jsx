import React from "react";

function FormCheck({ label, id, checked, onChange }) {
  return (
    <div className="form-check mb-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-check-input"
        id={id}
      />
      <label style={style.label} className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

const style = {
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#1a73e8",
    cursor: "pointer",
  },
};

export default FormCheck;

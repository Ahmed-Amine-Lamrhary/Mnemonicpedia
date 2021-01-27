import React from "react";
import colors from "../../utility/colors";

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
    color: colors.primary,
    cursor: "pointer",
  },
};

export default FormCheck;

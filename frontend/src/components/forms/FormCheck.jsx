import React from "react";
import colors from "../../utility/colors";
import "../../assets/css/formcheck.css";

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
      <label
        style={{ color: colors.primary }}
        className="fromchecklabel form-check-label"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}

export default FormCheck;

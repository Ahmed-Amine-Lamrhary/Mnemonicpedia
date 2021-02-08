import React from "react";
import "../../assets/css/formgroup.css";

function FormGroup({ type, label, value, onChange }) {
  return (
    <div className="formgroup form-group mb-3">
      <input
        className="forminput form-control"
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default FormGroup;

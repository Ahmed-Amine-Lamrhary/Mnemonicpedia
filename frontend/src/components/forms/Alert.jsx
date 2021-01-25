import React from "react";

function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible show`}>
      {message}
      {/* <button className="close" type="button">
        <span aria-hidden="true">&times;</span>
      </button> */}
    </div>
  );
}

export default Alert;

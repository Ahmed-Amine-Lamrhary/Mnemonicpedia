import React from "react";

function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible show`}>
      {message}
    </div>
  );
}

export default Alert;

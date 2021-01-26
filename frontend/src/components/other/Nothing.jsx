import React from "react";

function Nothing({ model = "item" }) {
  return <div>No {model} found in the database</div>;
}

export default Nothing;

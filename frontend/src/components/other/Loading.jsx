import React from "react";

function Loading({ loading }) {
  if (!loading) return null;
  return <div>Loading...</div>;
}

export default Loading;

import React, { useState } from "react";
import Loading from "./../other/Loading";

function Form({ onSubmit, children }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading loading={loading} />

      <form onSubmit={handleSubmit}>{children}</form>
    </>
  );
}

export default Form;

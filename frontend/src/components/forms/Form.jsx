import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import Loading from "./LoadingForm";

function Form({ onSubmit, location, children }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setSuccess("");
    setError("");

    if (location) {
      if (location.state) {
        const { message } = location.state;
        if (message) {
          if (message.type === "success") setSuccess(message.value);
          else setError(message.value);
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onSubmit();
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <Alert message={error} type="danger" />
      <Alert message={success} type="success" />

      <form onSubmit={handleSubmit}>{children}</form>
    </>
  );
}

export default Form;

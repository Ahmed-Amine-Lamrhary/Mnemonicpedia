import React, { useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import { activate } from "../../api/auth";
import Button from "../other/Button";

function ActivateAccount({ history, location }) {
  const [secretNumber, setSecretNumber] = useState("");
  if (!location.state) history.push("/login");

  const { email } = location.state;

  const handleActivate = async () => {
    await activate({ email, secretNumber }, history);
  };

  return (
    <div className="container">
      <Form onSubmit={handleActivate} location={location}>
        <label>
          Please enter the secret number we have sent to your email.
        </label>
        <FormGroup
          type="text"
          label="Secret Number"
          value={secretNumber}
          onChange={(e) => setSecretNumber(e.target.value)}
        />
        <Button type="submit">Activate Your Account</Button>
      </Form>
    </div>
  );
}

export default ActivateAccount;

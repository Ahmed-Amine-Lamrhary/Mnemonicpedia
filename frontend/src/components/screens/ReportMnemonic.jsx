import React, { useEffect, useState } from "react";
import { getMnemonic } from "../../api/mnemonic";
import { reportMnemonic } from "../../api/report";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import Button from "../other/Button";

function ReportMnemonic({ history, match, location }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { params } = match;

  const handleGetMnemonic = async () => {
    try {
      await getMnemonic(params.id);
    } catch (error) {
      console.error(error);
      history.push("/notFound");
    }
  };

  useEffect(() => {
    handleGetMnemonic();
  }, []);

  const handleReport = async () => {
    await reportMnemonic({ _id: params.id, title, content });
  };

  return (
    <div>
      <Form onSubmit={handleReport} location={location}>
        <FormGroup
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormGroup
          type="text"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit">Report</Button>
      </Form>
    </div>
  );
}

export default ReportMnemonic;

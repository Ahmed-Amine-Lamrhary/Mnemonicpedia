import React, { useEffect, useState } from "react";
import { getUser } from "../../api/user";
import { reportUser } from "../../api/report";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import Button from "../other/Button";

function ReportUser({ history, match, location }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { params } = match;

  const handleGetUser = async () => {
    try {
      await getUser(params.id);
    } catch (error) {
      console.error(error);
      history.push("/notFound");
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleReport = async () => {
    await reportUser({ _id: params.id, title, content });
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

export default ReportUser;

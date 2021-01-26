import React, { useEffect, useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import axios from "axios";
import config from "../../utility/config";
import Button from "../other/Button";
import { getToken } from "../../utility/auth";
import Editor from "../forms/Editor";

function Submit(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);

  axios.defaults.headers.common["x-auth-token"] = getToken();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const { data } = await axios.get(`${config.api}/category`);
    setCategories(data);
  };

  const handleSubmit = async () => {
    const { data } = await axios.post(`${config.api}/mnemonic`, {
      title,
      content,
      categories,
    });
    console.log(data);
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <FormGroup
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Editor
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select onChange={(e) => console.log(e.target.value)} multiple>
          {categories.map((category) => (
            <option key={category._id} value={JSON.stringify(category)}>
              {category.name}
            </option>
          ))}
        </select>
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

export default Submit;

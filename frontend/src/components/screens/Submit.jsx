import React, { useEffect, useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import Button from "../other/Button";
import Editor from "../forms/Editor";
import { getCategories } from "../../api/category";
import { createMnemonic } from "../../api/mnemonic";

function Submit(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleGetCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await createMnemonic({ title, content, categories });
    } catch (error) {
      console.error(error);
    }
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

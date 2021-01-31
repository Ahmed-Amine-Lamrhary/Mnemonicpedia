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
  // const [newCategory, setNewCategory] = useState("");

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
    await createMnemonic({ title, content, categories });
  };

  const addCategories = (e) => {
    // const keyCode = window.event ? e.which : e.keyCode;
    // if (keyCode !== 13) return;
    // const value = e.target.value;
    // const c = [...newCategories, value];
    // setNewCategories(c);
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

        <Editor label="Content" value={content} onChange={setContent} />

        {/* <div>
          {categories.map((category) => (
            <span key={category._id}>{category.name}</span>
          ))}
          {newCategories.map((category) => (
            <span>{category}</span>
          ))}
          <input type="text" placeholder="Categories" onKeyUp={addCategories} />
        </div> */}

        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

export default Submit;

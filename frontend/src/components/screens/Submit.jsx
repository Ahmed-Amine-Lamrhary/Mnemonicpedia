import React, { useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import Button from "../other/Button";
import Editor from "../forms/Editor";
import { getCategories } from "../../api/category";
import { createMnemonic } from "../../api/mnemonic";
import GroupFormDropdown from "../forms/GroupFormDropdown";

function Submit(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleGetCategories = async (searched) => {
    setCategory(searched);
    const selectedCategoriesIds = selectedCategories.map((category) => {
      return category._id;
    });

    try {
      const { data } = await getCategories({
        text: searched,
        exclude: selectedCategoriesIds,
      });
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const selectCategory = (item) => {
    const selected = [...selectedCategories, item];
    setSelectedCategories(selected);

    const newCategories = categories.filter(
      (category) => category._id !== item._id
    );
    setCategories(newCategories);
  };

  const handleSubmit = async () => {
    await createMnemonic({ title, content, categories: selectedCategories });
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

        <br />

        <GroupFormDropdown
          type="text"
          label="Categories"
          value={category}
          items={categories}
          onChange={(e) => handleGetCategories(e.target.value)}
          onSelect={selectCategory}
          selected={selectedCategories}
        />

        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

export default Submit;

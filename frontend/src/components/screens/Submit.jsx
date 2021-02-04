import React, { useEffect, useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/GroupForm";
import Button from "../other/Button";
import Editor from "../forms/Editor";
import { getCategories } from "../../api/category";
import {
  createMnemonic,
  getMnemonic,
  updateMnemonic,
} from "../../api/mnemonic";
import GroupFormDropdown from "../forms/GroupFormDropdown";

function Submit({ match, history }) {
  const [operation, setOperation] = useState("create");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (match.params.id) {
      setOperation("edit");
      handleGet();
    }
  }, []);

  const handleGet = async () => {
    try {
      const {
        data: { title, content, categories },
      } = await getMnemonic(match.params.id);
      setTitle(title);
      setContent(content);
      setCategories(categories);
    } catch (error) {
      console.log(error);
      history.push("/notFound");
    }
  };

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
    if (operation === "create")
      await createMnemonic({ title, content, categories: selectedCategories });
    else
      await updateMnemonic({
        _id: match.params.id,
        title,
        content,
        categories: selectedCategories,
      });
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
        <Button type="submit">{operation}</Button>
      </Form>
    </div>
  );
}

export default Submit;

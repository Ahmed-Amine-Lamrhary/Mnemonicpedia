import React, { useEffect, useState } from "react";
import Form from "../forms/Form";
import FormGroup from "../forms/FormGroup";
import Button from "../other/Button";
import Editor from "../forms/Editor";
import { getCategories } from "../../api/category";
import {
  createMnemonic,
  deleteMnemonic,
  getMnemonic,
  updateMnemonic,
} from "../../api/mnemonic";
import GroupFormDropdown from "../forms/GroupFormDropdown";
import MessageBox from "../other/MessageBox";

function Submit({ match, history }) {
  const [isMessageBox, setIsMessageBox] = useState(false);

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
      setSelectedCategories(categories);
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
    const categoriesIds = selectedCategories.map((category) => category._id);
    let value;
    if (operation === "create") {
      await createMnemonic({ title, content, categories: categoriesIds });
      value = "created";
    } else {
      await updateMnemonic({
        _id: match.params.id,
        title,
        content,
        categories: categoriesIds,
      });
      value = "edited";
    }
    history.push({
      pathname: "/",
      state: {
        message: {
          value: `Your mnemonic has been ${value} successfully. We will notify you once it is publlished.`,
        },
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteMnemonic(match.params.id);
      history.push({
        pathname: "/",
        state: {
          message: {
            value: "Your mnemonic has been deleted successfully",
          },
        },
      });
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsMessageBox(false);
    }
  };

  return (
    <div className="container">
      <MessageBox
        visible={isMessageBox}
        onClose={() => setIsMessageBox(false)}
        title="Are you sure you want to delete this mnemonic?"
        buttons={[
          {
            text: "No",
            bgColor: "primary",
            onClick: () => setIsMessageBox(false),
          },
          {
            text: "Yes",
            bgColor: "danger",
            onClick: () => handleDelete(),
          },
        ]}
      />

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
        {operation === "edit" && (
          <Button bgColor="danger" onClick={() => setIsMessageBox(true)}>
            Delete
          </Button>
        )}
      </Form>
    </div>
  );
}

export default Submit;

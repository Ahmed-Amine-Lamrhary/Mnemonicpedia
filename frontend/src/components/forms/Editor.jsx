import React from "react";
// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import FroalaEditor from "react-froala-wysiwyg";

function Editor({ label, value, onChange }) {
  return (
    // <textarea
    //   style={style.input}
    //   className="form-control"
    //   placeholder={label}
    //   onChange={onChange}
    // >
    //   {value}
    // </textarea>
    <FroalaEditor onModelChange={onChange} model={value} tag="textarea" />
  );
}

const style = {
  container: { position: "relative", marginBottom: "20px" },
  input: {
    borderRadius: "3px",
    border: "1px solid #d0d0d0",
    padding: "14px 12px",
    fontSize: "14px",
    transition: "all 0.1s ease-in-out",
    height: "auto",
    boxShadow: "none",
    minHeight: "200px",
  },
};

export default Editor;

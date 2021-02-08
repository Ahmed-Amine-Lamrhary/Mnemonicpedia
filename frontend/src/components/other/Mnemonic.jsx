import React from "react";
import generateUrl from "generate-url";
import { Link } from "react-router-dom";
import { getMe } from "../../api/me";
import Button from "./Button";
import "../../assets/css/mnemonic.css";

function Mnemonic({ mnemonic, onLike }) {
  const { _id, title, content, author, likes } = mnemonic;

  if (!_id) return null;
  const user = getMe();

  return (
    <div className="mnemonic">
      <div className="options">
        <div>
          <Link
            className="mnemonic-icon"
            style={{ marginLeft: "0" }}
            to={`/user/${author._id}`}
          >
            <i className="ri-user-line"></i>
            <span className="author">{author.fullname}</span>
          </Link>
        </div>

        <div>
          {user && user._id === author._id && (
            <Link to={`/edit/${_id}`} className="mnemonic-icon">
              <i className="ri-pencil-line"></i>
            </Link>
          )}

          <Link to={`/report-mnemonic/${_id}`} className="report">
            <i className="ri-flag-2-line"></i>
          </Link>
        </div>
      </div>

      <h4 className="title">
        <Link to={`/${generateUrl(title)}/${_id}`}>{title}</Link>
      </h4>

      <div dangerouslySetInnerHTML={{ __html: content }} />

      <div className="helpful">
        Helpful?
        {user && (
          <Button
            bgColor={likes.includes(user._id) ? "primary" : "white"}
            onClick={() => onLike(mnemonic._id)}
            className="mnemonic-btn"
          >
            <i className="ri-thumb-up-line"></i>
            <span>{likes.length}</span>
          </Button>
        )}
        {!user && (
          <Button bgColor="white" className="mnemonic-btn" to="/login">
            <i className="ri-thumb-up-line"></i>
            <span>{likes.length}</span>
          </Button>
        )}
        <Button bgColor="white" className="mnemonic-btn">
          <i className="ri-share-forward-line"></i> Share
        </Button>
      </div>
    </div>
  );
}

export default Mnemonic;

import React from "react";
import generateUrl from "generate-url";
import { Link } from "react-router-dom";
import { getMe } from "../../api/me";
import colors from "../../utility/colors";
import Button from "./Button";

function Mnemonic({ mnemonic, onDelete, onLike }) {
  const { _id, title, content, author, likes } = mnemonic;

  if (!_id) return null;
  const user = getMe();

  return (
    <div style={style.container} className="mnemonic">
      <Link
        style={style.report}
        to={`/report-mnemonic/${_id}`}
        className="report"
      >
        <i className="ri-flag-2-line"></i>
      </Link>

      <h4 style={style.title}>
        <Link style={style.titleLink} to={`/${generateUrl(title)}/${_id}`}>
          {title}
        </Link>
      </h4>

      <div dangerouslySetInnerHTML={{ __html: content }} />

      <div style={style.helpful} className="helpful">
        Helpful?
        {user && (
          <Button
            bgColor={likes.includes(user._id) ? "primary" : "white"}
            addStyle={style.btn}
            onClick={() => onLike(mnemonic)}
          >
            <i style={style.btnIcon} className="ri-thumb-up-line"></i>
            <span>{likes.length}</span>
          </Button>
        )}
        {!user && (
          <Button bgColor="white" addStyle={style.btn} to="/login">
            <i style={style.btnIcon} className="ri-thumb-up-line"></i>
            <span>{likes.length}</span>
          </Button>
        )}
        <Button bgColor="white" addStyle={style.btn}>
          <i style={style.btnIcon} className="ri-share-forward-line"></i> Share
        </Button>
      </div>

      {user && user._id === author._id && (
        <Button bgColor="danger" onClick={() => onDelete(_id)}>
          Delete
        </Button>
      )}

      <Link to={`/user/${author._id}`}>{author.fullname}</Link>
    </div>
  );
}

const style = {
  container: {
    padding: "26px 40px",
    border: "1px solid #f1f3f4",
    borderRadius: "8px",
    margin: "20px 0",
    position: "relative",
  },
  title: {
    marginTop: "0",
    fontSize: "18px",
    lineHeight: "23px",
    display: "inline-block",
    color: colors.primary,
  },
  titleLink: {
    textDecoration: "none",
    color: "inherit",
  },
  helpful: {
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    WebkitBoxAlign: "center",
    MozBoxAlign: "center",
    MsFlexAlign: "center",
    WebkitAlignItems: "center",
    alignItems: "center",
  },
  btn: {
    border: "1px solid #f1f3f4",
    padding: "6px 12px",
    fontWeight: "400",
    fontSize: "12px",
    marginLeft: "8px",
    boxShadow: "none",
    display: "inline-flex",
    WebkitBoxAlign: "center",
    MozBoxAlign: "center",
    MsFlexAlign: "center",
    WebkitAlignItems: "center",
    alignItems: "center",
    transition: "border 0.2s ease-in-out",
  },
  btnIcon: { fontSize: "15px", marginRight: "8px" },
  report: {
    position: "absolute",
    top: "26px",
    right: "40px",
    color: "#919292",
    fontSize: "20px",
    textDecoration: "none",
  },
};

export default Mnemonic;

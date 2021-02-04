import React from "react";
import generateUrl from "generate-url";
import { Link } from "react-router-dom";
import { getMe } from "../../api/me";
import colors from "../../utility/colors";
import Button from "./Button";

function Mnemonic({ mnemonic, onLike }) {
  const { _id, title, content, author, likes } = mnemonic;

  if (!_id) return null;
  const user = getMe();

  return (
    <div style={style.container} className="mnemonic">
      <div style={style.options}>
        <div>
          <Link
            style={{ ...style.icon, marginLeft: "0" }}
            to={`/user/${author._id}`}
          >
            <i className="ri-user-line"></i>
            <span style={style.author}>{author.fullname}</span>
          </Link>
        </div>

        <div>
          {user && user._id === author._id && (
            <Link style={style.icon} to={`/edit/${_id}`} className="report">
              <i className="ri-pencil-line"></i>
            </Link>
          )}

          <Link
            style={style.icon}
            to={`/report-mnemonic/${_id}`}
            className="report"
          >
            <i className="ri-flag-2-line"></i>
          </Link>
        </div>
      </div>

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
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid",
    borderColor: "rgb(241 241 241)",
    paddingBottom: "8px",
  },
  icon: {
    color: "#919292",
    fontSize: "20px",
    textDecoration: "none",
    marginLeft: "13px",
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: "15px",
    fontWeight: 500,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "6px",
  },
};

export default Mnemonic;

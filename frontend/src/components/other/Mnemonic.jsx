import React from "react";
import { Link } from "react-router-dom";

function Mnemonic({ mnemonic: { title, content } }) {
  return (
    <div style={style.container} className="mnemonic">
      <Link
        style={style.report}
        to="/report-mnemonic-148745"
        className="report"
      >
        <i className="ri-flag-2-line"></i>
      </Link>

      <h4 style={style.title}>
        <Link style={style.titleLink} to="/">
          {title}
        </Link>
      </h4>

      <div>{content}</div>

      <div style={style.helpful} className="helpful">
        Helpful?
        <a style={style.btn} href="login" className="btn">
          <i style={style.btnIcon} className="ri-thumb-up-line"></i>{" "}
          <span>0</span>
        </a>
        <button style={style.btn} className="btn share">
          <i style={style.btnIcon} className="ri-share-forward-line"></i> Share
        </button>
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
    color: "#1a73e8",
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
    background: "transparent",
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

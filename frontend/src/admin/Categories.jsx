import React from "react";

function Categories(props) {
  return (
    <div className="results">
      <div className="table">
        {/* HEADER */}
        <div className="tr">
          <div className="th"></div>
          <div className="th">Name</div>
          <div className="th">ID</div>
          <div className="th">Email</div>
          <div className="th">Date Joined</div>
          <div className="th">Posts</div>
          <div className="th">Status</div>
          <div className="th">Response</div>
        </div>

        {/* BODY */}
        <div className="tr">
          <div className="td">
            <span className="stat active"></span>
          </div>
          <div className="td name">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://mnemonicpedia.com/user/1"
            >
              Dr M Arad
            </a>
          </div>
          <div className="td small">#1</div>
          <div className="td small">ahmedamro86@gmail.com</div>
          <div className="td">04 Jun 2020</div>
          <div className="td">10</div>
          <div className="td userStat active">active</div>
          <div className="td">
            <button
              onclick="userAction('suspended', '1', this)"
              className="suspend"
            >
              Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;

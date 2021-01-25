import React, { useState } from "react";

function SearchBox({ content: Content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div onClick={() => setIsVisible(!isVisible)}>
        <Content />
      </div>

      {isVisible && (
        <div className="modal modal-search">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <input
                  type="text"
                  className="form-control"
                  placeholder="SEARCH"
                />
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsVisible(false)}
                >
                  <i class="tim-icons icon-simple-remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBox;

import React from "react";

function MessageBox({ visible, onClose, title, body, buttons }) {
  if (!visible) return null;
  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {title && <h5 className="modal-title">{title}</h5>}
            {onClose && (
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
          {body && (
            <div className="modal-body">
              <p>{body}</p>
            </div>
          )}
          {buttons && (
            <div className="modal-footer">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn btn-${button.colorClass}`}
                  onClick={button.onClick}
                >
                  {button.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBox;

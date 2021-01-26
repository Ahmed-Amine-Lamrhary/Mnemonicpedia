import React from "react";
import Button from "./Button";

function MessageBox({ visible, onClose, title, body, buttons }) {
  if (!visible) return null;
  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {title && <h5 className="modal-title">{title}</h5>}
            {onClose && (
              <Button className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </Button>
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
                <Button
                  key={index}
                  onClick={button.onClick}
                  bgColor={button.bgColor}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBox;

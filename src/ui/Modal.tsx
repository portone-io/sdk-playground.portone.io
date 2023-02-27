import * as React from "react";

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <div>
      <div>
        <div>
          {title}
          <button onClick={onClose}>X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default Modal;

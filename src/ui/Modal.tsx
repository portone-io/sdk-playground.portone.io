import * as React from "react";

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-20 pointer-events-none">
      <div className="max-w-screen-sm w-full h-full bg-white pointer-events-auto">
        <div className="p-4 flex flex-row items-center text-2xl">
          <span className="flex-1">
            {title}
          </span>
          <button onClick={onClose} title="close">
            <svg className="w-6 h-6" viewBox="0 0 30 30">
              <line x1="0" y1="0" x2="30" y2="30" stroke="black" />
              <line x1="30" y1="0" x2="0" y2="30" stroke="black" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex flex-wrap gap-2">{children}</div>
      </div>
    </div>
  );
};
export default Modal;

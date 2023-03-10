import * as React from "react";

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  React.useEffect(() => {
    if (open) document.documentElement.classList.add("modal");
    else document.documentElement.classList.remove("modal");
    return () => document.documentElement.classList.remove("modal");
  }, [open]);
  const dim = `transition-colors ${
    open ? "bg-[#0003]" : "pointer-events-none"
  }`;
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-20 ${dim}`}
      onClick={onClose}
    >
      <div
        style={{
          transform: open ? "" : "translateY(5rem)",
          opacity: open ? 1 : 0,
        }}
        className="sm:mt-4 mx-auto max-w-screen-sm w-full h-[40rem] max-sm:h-full max-h-full flex flex-col bg-white drop-shadow-xl sm:rounded-lg transition-all"
        onClick={(e) => e.stopPropagation()}
      >
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
        <div className="relative min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;

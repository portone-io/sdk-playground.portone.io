import * as React from "react";

export interface ToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: boolean;
  onToggle: (value: boolean) => void;
}
export const Toggle: React.FC<ToggleProps> = (
  { className = "", value, onToggle, ...props },
) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const baseClassName =
    "relative w-10 h-6 rounded-full bg-slate-300 cursor-pointer transition-color after:absolute after:top-1 after:w-4 after:h-4 after:rounded-full after:transition-all";
  const transitionClassName = value
    ? "bg-orange-400 after:bg-white after:left-5"
    : "bg-slate-300 after:bg-slate-100 after:left-1";
  return (
    <div
      className={`${baseClassName} ${transitionClassName} ${className}`}
      {...props}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="checkbox"
        checked={value}
        onClick={() => onToggle(!value)}
      />
    </div>
  );
};
export default Toggle;

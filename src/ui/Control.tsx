import * as React from "react";

export const RequiredIndicator: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className = "", ...props }) => {
  return (
    <div
      aria-label="필수"
      className={`w-2 h-2 inline-block bg-orange-700 rounded ${className}`}
      {...props}
    />
  );
};

export interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  code: string;
  required?: boolean;
  enabled?: boolean;
  radioGroup?: string;
  onToggle?: (enabled: boolean) => void;
}
const Control: React.FC<ControlProps> = ({
  className,
  children,
  label,
  code,
  required,
  enabled,
  radioGroup,
  onToggle,
  ...props
}) => {
  const inputId = `input-${code}-${Math.random().toString(36).slice(2)}`;
  return (
    <div className={`flex flex-row ${className || ""} gap-1`} {...props}>
      <label className="basis-4 shrink-0 flex items-center justify-center">
        <div className="w-full h-full py-1 flex flex-col items-center justify-start bg-orange-50 rounded">
          {required ? <RequiredIndicator /> : (
            <input
              id={inputId}
              className="control-checkbox"
              type={radioGroup ? "radio" : "checkbox"}
              name={radioGroup}
              checked={enabled}
              onChange={(e) => onToggle?.(e.currentTarget.checked)}
            />
          )}
        </div>
      </label>
      <div
        className={`flex-1 flex flex-col ${
          (required || enabled) ? "" : "opacity-50"
        }`}
      >
        <label className="inline-flex flex-wrap" htmlFor={inputId}>
          <span className="mr-2">{label}</span>
          <div className="inline-flex items-center h-6">
            <code className="px-1 rounded text-xs leading-3 text-orange-900 bg-orange-100">
              {code}
            </code>
          </div>
        </label>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default Control;

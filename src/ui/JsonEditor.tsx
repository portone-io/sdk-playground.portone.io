import * as React from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface JsonEditorProps extends ReactCodeMirrorProps {
  onReset?: () => void;
}
const JsonEditor: React.FC<JsonEditorProps> = (
  { extensions = [], value, onChange, onReset, ...props },
) => {
  // react-codemirror는 managed component 방식으로 사용할 때
  // 타이핑 도중 무한루프를 일으키는 버그가 있으므로
  // unmanaged component로 만들기 위해 처음 입력받은 value를 고정합니다.
  const [initialValue, setInitialValue] = React.useState(value);
  const [internalValue, setInternalValue] = React.useState(value);

  if (value !== internalValue) {
    setInitialValue(value);
    setInternalValue(value);
    onReset?.();
  }

  return (
    <CodeMirror
      height="100%"
      value={initialValue}
      extensions={[json(), ...extensions]}
      onChange={(json, viewUpdate) => {
        setInternalValue(json);
        onChange?.(json, viewUpdate);
      }}
      {...props}
    />
  );
};

export default JsonEditor;

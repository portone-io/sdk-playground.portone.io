import * as React from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface JsonEditorProps extends ReactCodeMirrorProps {}
const JsonEditor: React.FC<JsonEditorProps> = (
  { extensions = [], ...props },
) => {
  return (
    <CodeMirror
      height="100%"
      extensions={[json(), ...extensions]}
      {...props}
    />
  );
};

export default JsonEditor;

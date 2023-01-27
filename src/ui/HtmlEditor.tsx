import * as React from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

interface HtmlEditorProps extends ReactCodeMirrorProps {}
const HtmlEditor: React.FC<HtmlEditorProps> = (props) => {
  return (
    <CodeMirror
      height="100%"
      extensions={[html()]}
      {...props}
    />
  );
};

export default HtmlEditor;

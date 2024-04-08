import type * as React from "react";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

interface JavascriptEditorProps extends ReactCodeMirrorProps {}
const JavascriptEditor: React.FC<JavascriptEditorProps> = (props) => {
  return <CodeMirror height="100%" extensions={[javascript()]} {...props} />;
};

export default JavascriptEditor;

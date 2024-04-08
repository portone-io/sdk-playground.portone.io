import { javascript } from "@codemirror/lang-javascript";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type * as React from "react";

interface JavascriptEditorProps extends ReactCodeMirrorProps {}
const JavascriptEditor: React.FC<JavascriptEditorProps> = (props) => {
	return <CodeMirror height="100%" extensions={[javascript()]} {...props} />;
};

export default JavascriptEditor;

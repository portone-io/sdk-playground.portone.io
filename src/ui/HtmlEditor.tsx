import { html } from "@codemirror/lang-html";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type * as React from "react";

interface HtmlEditorProps extends ReactCodeMirrorProps {}
const HtmlEditor: React.FC<HtmlEditorProps> = (props) => {
	return <CodeMirror height="100%" extensions={[html()]} {...props} />;
};

export default HtmlEditor;

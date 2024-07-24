import type { ReadonlySignal } from "@preact/signals";
import HtmlEditor from "../HtmlEditor";

interface CodeExampleTabProps {
	codePreviewSignal: ReadonlySignal<string>;
}

export const CodeExampleTab = ({ codePreviewSignal }: CodeExampleTabProps) => {
	return (
		<div
			className="md:sticky top-4 flex flex-col"
			style={{ height: "calc(100vh - 2rem)" }}
		>
			<div className="flex-1">
				<HtmlEditor
					className="h-full"
					editable={false}
					value={codePreviewSignal.value}
				/>
			</div>
		</div>
	);
};

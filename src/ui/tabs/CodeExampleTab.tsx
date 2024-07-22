import type { ReadonlySignal } from "@preact/signals";
import HtmlEditor from "../HtmlEditor";

interface CodeExampleTabProps {
	codePreviewSignal: ReadonlySignal<string>;
}

export const CodeExampleTab = ({ codePreviewSignal }: CodeExampleTabProps) => {
	return (
		<div className="md:sticky top-4 grid grid-rows-1 auto-cols-fr">
			<HtmlEditor
				className="h-full min-h-[calc(100dvh-2rem)]"
				editable={false}
				value={codePreviewSignal.value}
			/>
		</div>
	);
};

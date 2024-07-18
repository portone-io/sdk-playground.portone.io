import {
	type ReadonlySignal,
	useSignal,
	useSignalEffect,
} from "@preact/signals";

interface Size {
	width: number | undefined;
	height: number | undefined;
}

export function useWindowSize(): ReadonlySignal<Size> {
	const windowSize = useSignal<Size>({
		width: undefined,
		height: undefined,
	});

	useSignalEffect(() => {
		function handleResize() {
			windowSize.value = {
				width: window.innerWidth,
				height: window.innerHeight,
			};
		}
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});

	return windowSize;
}

import { type Signal, useSignal } from "@preact/signals";
import { useEffect } from "react";

export function useMediaQueryMatches(query: string): Signal<boolean> {
	const matchesSignal = useSignal(window.matchMedia(query).matches);
	useEffect(() => {
		window.matchMedia(query).onchange = (e) => {
			matchesSignal.value = e.matches;
		};
	});
	return matchesSignal;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

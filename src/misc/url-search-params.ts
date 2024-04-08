import * as React from "react";

export function useUrlSearchParams() {
	const search = globalThis.location.search;
	return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useUrlSearchParam(key: string): string[] {
	const params = useUrlSearchParams();
	return React.useMemo(() => params.getAll(key), [key, params]);
}

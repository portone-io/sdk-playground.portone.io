// https://github.com/vitejs/vite/issues/14850#issuecomment-1907266103
export function importStatic(modulePath: string) {
	if (import.meta.env.DEV) {
		return import(/* @vite-ignore */ `${modulePath}?${Date.now()}`);
	}
	return import(/* @vite-ignore */ modulePath);
}

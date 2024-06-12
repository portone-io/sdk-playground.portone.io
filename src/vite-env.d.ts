/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CORE_SERVER_URL: string;
	readonly VITE_CHECKOUT_SERVER_URL: string;
	readonly VITE_BROWSER_SDK_V2: string | undefined;
	readonly VITE_BROWSER_SDK_V1: string | undefined;
	readonly VITE_BROWSER_SDK_V1_LEGACY: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

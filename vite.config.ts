import preact from "@preact/preset-vite";
import yaml from "@rollup/plugin-yaml";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [preact(), yaml()],
		server: {
			host: "0.0.0.0",
			port: 3000,
		},
		build: {
			rollupOptions: {
				external: [env.VITE_BROWSER_SDK_V1, env.VITE_BROWSER_SDK_V2],
			},
		},
	};
});

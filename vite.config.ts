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
		define: {
			"process.env.LOCAL_SDK": JSON.stringify(env.LOCAL_SDK),
		},
		build: {
			rollupOptions: {
				external: ["/sdk/v2/browser-sdk.esm.js", "/sdk/v1/iamport.esm.js"],
			},
		},
	};
});

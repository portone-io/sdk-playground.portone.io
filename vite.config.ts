import preact from "@preact/preset-vite";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [preact(), yaml()],
	server: {
		host: "0.0.0.0",
		port: 3000,
	},
	build: {
		rollupOptions: {
			external: ["/sdk/v2/browser-sdk.esm.js", "/sdk/v1/iamport.esm.js"],
		},
	},
});

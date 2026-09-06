import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: { "@": new URL(".", import.meta.url).pathname },
	},
	test: {
		environment: "node",
		include: ["tests/**/*.{test,spec}.{ts,tsx}"],
	},
});

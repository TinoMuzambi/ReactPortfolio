import { defineConfig } from "vitest/config";

export default defineConfig({
	oxc: {
		jsx: { runtime: "automatic" },
	},
	test: {
		environment: "jsdom",
		include: ["tests/**/*.{test,spec}.{ts,tsx}"],
		setupFiles: ["./tests/setup.ts"],
	},
});

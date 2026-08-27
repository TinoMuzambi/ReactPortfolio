import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
	...nextVitals,
	{
		files: ["pages/_document.tsx"],
		rules: {
			// The existing Universal Analytics integration will be migrated separately.
			"@next/next/next-script-for-ga": "off",
		},
	},
	globalIgnores([".next/**", "coverage/**", "out/**"]),
]);

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
	...nextVitals,
	{
		files: ["pages/_document.jsx"],
		rules: {
			// The existing Universal Analytics integration will be migrated separately.
			"@next/next/next-script-for-ga": "off",
		},
	},
	{
		files: ["pages/api/email/index.js"],
		rules: {
			// Preserve the legacy endpoint until its validation/security refactor.
			"import/no-anonymous-default-export": "off",
		},
	},
	globalIgnores([".next/**", "coverage/**", "out/**"]),
]);

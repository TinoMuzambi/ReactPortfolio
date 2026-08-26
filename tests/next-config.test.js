import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require("../next.config.js");

describe("Next.js production configuration", () => {
	it("bundles html-react-parser so Pages Router ISR can load its ESM dependencies", () => {
		expect(nextConfig.transpilePackages).toContain("html-react-parser");
	});
});

import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";

describe("Next.js production configuration", () => {
	it("bundles html-react-parser so Pages Router ISR can load its ESM dependencies", () => {
		expect(nextConfig.transpilePackages).toContain("html-react-parser");
	});
});

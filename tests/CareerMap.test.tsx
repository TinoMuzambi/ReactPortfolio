import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CareerMap from "@/components/CareerMap";

describe("Cape Lines career map", () => {
	it("keeps key evidence in the server-rendered document", () => {
		const markup = renderToStaticMarkup(<CareerMap />);

		expect(markup).toContain("MusicRecPathSignatures");
		expect(markup).toContain("more than 38 research projects");
		expect(markup).toContain(
			"No public project details are available for this current role."
		);
	});

	it("renders all route controls without selecting a partial view", () => {
		const markup = renderToStaticMarkup(<CareerMap />);

		expect(markup.match(/<button class="route-control/g)).toHaveLength(4);
		expect(markup).toContain('aria-pressed="true"');
		expect(markup).toContain("All routes");
	});
});

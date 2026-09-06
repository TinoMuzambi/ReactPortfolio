import { describe, expect, it } from "vitest";

import { portfolio, selectedProjects } from "@/content/portfolio";

const collectIds = (items: readonly { id: string }[]) => items.map((item) => item.id);

describe("canonical portfolio content", () => {
	it("uses unique stable identifiers", () => {
		for (const collection of [
			portfolio.experience,
			portfolio.education,
			portfolio.projects,
		]) {
			const ids = collectIds(collection);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it("leads with verified engineering and research work", () => {
		expect(selectedProjects.map((project) => project.id)).toEqual([
			"music-rec-path-signatures",
			"advice",
			"clock-in-out",
			"recomments",
		]);
	});

	it("contains only direct or local public URLs", () => {
		const links = [
			portfolio.profile.website,
			...portfolio.profile.links.map((link) => link.href),
			...portfolio.projects.flatMap((project) =>
				[project.liveUrl, project.sourceUrl, project.referenceUrl].filter(
					(value): value is string => Boolean(value)
				)
			),
		];

		for (const link of links) {
			expect(new URL(link).protocol).toBe("https:");
			expect(link).not.toContain("bit.ly");
			expect(link.toLowerCase()).not.toContain("storyblok");
		}
	});

	it("publishes the supplied current-role responsibilities", () => {
		expect(portfolio.experience[0]).toMatchObject({
			role: "Intermediate Developer",
			organisation: "OVEX",
		});
		expect(portfolio.experience[0].highlights).toHaveLength(5);
		expect(portfolio.experience[0].highlights.join(" ")).toContain("React Native");
		expect(portfolio.experience[0].highlights.join(" ")).toContain("GraphQL");
	});

	it("records the MSc as completed without claiming graduation", () => {
		const masters = portfolio.education[0];
		expect(masters.period).toBe("2024 – 2026");
		expect(masters.details.join(" ")).toContain("Completed in 2026");
		expect(masters.details.join(" ")).toContain("graduation is scheduled for March 2027");
	});
});

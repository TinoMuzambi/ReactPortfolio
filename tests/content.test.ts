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
		expect(masters.details.join(" ")).toContain("Graduation is scheduled for March 2027");
	});

	it("publishes AI-assisted engineering and home-server practice", () => {
		const skills = portfolio.skillGroups.flatMap((group) => group.items);
		expect(portfolio.profile.headline).toContain("strong software foundations");
		expect(portfolio.profile.headline).toContain("AI-assisted delivery");
		expect(portfolio.profile.headline.toLowerCase()).not.toContain("applied data");
		expect(skills).toContain("Claude Code");
		expect(skills).toContain("Codex");
		expect(skills).toContain("React Native");
		expect(skills).toContain("R");
		expect(skills).toContain("AWS");
		expect(skills).toContain("Azure");
		expect(skills).toContain("GCP");
		expect(skills).toContain("Home server administration");
		expect(skills).toContain("Backups");
	});

	it("links to the wider project archive", () => {
		expect(portfolio.profile.links).toContainEqual({
			label: "Project archive",
			href: "https://projects.tinomuzambi.com",
		});
	});

	it("keeps semicolons and em dashes out of public content", () => {
		expect(JSON.stringify(portfolio)).not.toMatch(/[;—]/);
	});
});

import { describe, expect, it } from "vitest";

import { portfolio, selectedProjects } from "@/content/portfolio";
import { projectsPayload, resumePayload } from "@/lib/public-data";

describe("machine-readable portfolio data", () => {
	it("projects output derives from canonical project content", () => {
		expect(projectsPayload.count).toBe(portfolio.projects.length);
		expect(projectsPayload.projects).toBe(portfolio.projects);
	});

	it("résumé output derives from canonical profile and selections", () => {
		expect(resumePayload.person).toBe(portfolio.profile);
		expect(resumePayload.experience).toBe(portfolio.experience);
		expect(resumePayload.education).toBe(portfolio.education);
		expect(resumePayload.selectedProjects).toBe(selectedProjects);
	});

	it("exposes explicit, versioned public-resource metadata", () => {
		expect(resumePayload.schemaVersion).toBe("1.0");
		expect(resumePayload.resources.allProjects).toBe(
			"https://tinomuzambi.com/projects.json"
		);
		expect(resumePayload.resources.projectArchive).toBe(
			"https://projects.tinomuzambi.com"
		);
	});
});

import { describe, expect, it } from "vitest";

import { portfolio, selectedProjects } from "@/content/portfolio";
import { cvPayload, projectsPayload } from "@/lib/public-data";

describe("machine-readable portfolio data", () => {
	it("projects output derives from canonical project content", () => {
		expect(projectsPayload.count).toBe(portfolio.projects.length);
		expect(projectsPayload.projects).toBe(portfolio.projects);
	});

	it("CV output derives from canonical profile and selections", () => {
		expect(cvPayload.person).toBe(portfolio.profile);
		expect(cvPayload.experience).toBe(portfolio.experience);
		expect(cvPayload.education).toBe(portfolio.education);
		expect(cvPayload.certifications).toBe(portfolio.certifications);
		expect(cvPayload.selectedProjects).toBe(selectedProjects);
	});

	it("exposes explicit, versioned public-resource metadata", () => {
		expect(cvPayload.schemaVersion).toBe("1.0");
		expect(cvPayload.resources.allProjects).toBe(
			"https://tinomuzambi.com/projects.json"
		);
		expect(cvPayload.resources.cvPdf).toBe(
			"https://tinomuzambi.com/tinotenda-muzambi-cv.pdf"
		);
		expect(cvPayload.resources.projectArchive).toBe(
			"https://projects.tinomuzambi.com"
		);
	});
});

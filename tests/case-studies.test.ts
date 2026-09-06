import { describe, expect, it } from "vitest";

import {
	caseStudies,
	getCaseStudy,
	getCaseStudyProject,
} from "@/content/case-studies";
import { softwareSourceCodeJsonLd } from "@/lib/project-schema";

describe("decision files", () => {
	it("use stable unique routes backed by canonical projects", () => {
		const slugs = caseStudies.map((caseStudy) => caseStudy.slug);
		expect(new Set(slugs).size).toBe(slugs.length);

		for (const caseStudy of caseStudies) {
			expect(getCaseStudy(caseStudy.slug)).toBe(caseStudy);
			expect(getCaseStudyProject(caseStudy).id).toBe(caseStudy.projectId);
		}
	});

	it("separates traces, evidence and unknowns", () => {
		for (const caseStudy of caseStudies) {
			expect(caseStudy.traces.length).toBeGreaterThanOrEqual(3);
			expect(caseStudy.evidence.length).toBeGreaterThan(0);
			expect(caseStudy.unknowns.length).toBeGreaterThan(0);
			for (const trace of caseStudy.traces) {
				expect(trace.constraint).toBeTruthy();
				expect(trace.decision).toBeTruthy();
				expect(trace.evidence).toBeTruthy();
			}
		}
	});

	it("publishes SoftwareSourceCode metadata for every selected project", () => {
		for (const caseStudy of caseStudies) {
			const project = getCaseStudyProject(caseStudy);
			const schema = softwareSourceCodeJsonLd(caseStudy, project);
			expect(schema["@type"]).toBe("SoftwareSourceCode");
			expect(schema.url).toContain(`/work/${caseStudy.slug}`);
			expect(schema.name).toBe(project.name);
		}
	});
});

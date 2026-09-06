import { describe, expect, it } from "vitest";

import {
	evidenceLenses,
	orderEvidence,
	type EvidenceItem,
} from "@/lib/evidence";

const makeItem = (
	id: string,
	rank: EvidenceItem["rank"]
): EvidenceItem => ({
	id,
	kind: "Test evidence",
	title: id,
	source: "Test source",
	period: "Test period",
	signal: "Test signal",
	summary: "Test summary",
	details: [],
	relevantFor: ["full-stack", "data", "leadership"],
	rank,
});

const evidence = [
	makeItem("product", { "full-stack": 1, data: 3, leadership: 2 }),
	makeItem("research", { "full-stack": 3, data: 1, leadership: 3 }),
	makeItem("team", { "full-stack": 2, data: 2, leadership: 1 }),
];

describe("evidence role lens", () => {
	it("defines the three hiring perspectives", () => {
		expect(evidenceLenses.map((lens) => lens.id)).toEqual([
			"full-stack",
			"data",
			"leadership",
		]);
	});

	it("reorders the complete record without mutating or removing items", () => {
		expect(orderEvidence(evidence, "full-stack").map((item) => item.id)).toEqual([
			"product",
			"team",
			"research",
		]);
		expect(orderEvidence(evidence, "data").map((item) => item.id)).toEqual([
			"research",
			"team",
			"product",
		]);
		expect(orderEvidence(evidence, "leadership").map((item) => item.id)).toEqual([
			"team",
			"product",
			"research",
		]);
		expect(evidence.map((item) => item.id)).toEqual(["product", "research", "team"]);
	});
});

export type EvidenceLens = "full-stack" | "data" | "leadership";

export interface EvidenceLink {
	readonly label: string;
	readonly href: string;
}

export interface EvidenceItem {
	readonly id: string;
	readonly kind: string;
	readonly title: string;
	readonly source: string;
	readonly period: string;
	readonly signal: string;
	readonly summary: string;
	readonly details: readonly string[];
	readonly technologies?: readonly string[];
	readonly links?: readonly EvidenceLink[];
	readonly relevantFor: readonly EvidenceLens[];
	readonly rank: Readonly<Record<EvidenceLens, number>>;
}

export const evidenceLenses: readonly {
	readonly id: EvidenceLens;
	readonly label: string;
	readonly description: string;
}[] = [
	{
		id: "full-stack",
		label: "Full-stack",
		description: "Product delivery, application architecture and production systems first.",
	},
	{
		id: "data",
		label: "Data",
		description: "Research, analysis and data-intensive systems first.",
	},
	{
		id: "leadership",
		label: "Leadership",
		description: "Team direction, mentoring and operational responsibility first.",
	},
] as const;

export const orderEvidence = (
	items: readonly EvidenceItem[],
	lens: EvidenceLens
): EvidenceItem[] => [...items].sort((a, b) => a.rank[lens] - b.rank[lens]);

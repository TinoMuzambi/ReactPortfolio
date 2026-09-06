export interface DecisionTrace {
	readonly constraint: string;
	readonly decision: string;
	readonly evidence: string;
}

export interface EvidenceLink {
	readonly label: string;
	readonly href: string;
}

export interface CaseStudy {
	readonly slug: string;
	readonly projectId: string;
	readonly statement: string;
	readonly problem: string;
	readonly traces: readonly DecisionTrace[];
	readonly evidence: readonly string[];
	readonly unknowns: readonly string[];
	readonly links: readonly EvidenceLink[];
}

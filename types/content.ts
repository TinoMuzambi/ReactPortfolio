export interface ExternalLink {
	readonly label: string;
	readonly href: string;
}

export interface Profile {
	readonly name: string;
	readonly role: string;
	readonly headline: string;
	readonly summary: string;
	readonly location: string;
	readonly email: string;
	readonly website: string;
	readonly links: readonly ExternalLink[];
}

export interface Experience {
	readonly id: string;
	readonly role: string;
	readonly organisation: string;
	readonly period: string;
	readonly highlights: readonly string[];
}

export interface Education {
	readonly id: string;
	readonly qualification: string;
	readonly institution: string;
	readonly period: string;
	readonly details: readonly string[];
}

export interface Certification {
	readonly id: string;
	readonly name: string;
	readonly issuer: string;
}

export interface Project {
	readonly id: string;
	readonly name: string;
	readonly summary: string;
	readonly technologies: readonly string[];
	readonly featured: boolean;
	readonly liveUrl?: string;
	readonly sourceUrl?: string;
	readonly referenceUrl?: string;
}

export interface SkillGroup {
	readonly label: string;
	readonly items: readonly string[];
}

export interface PortfolioContent {
	readonly profile: Profile;
	readonly experience: readonly Experience[];
	readonly education: readonly Education[];
	readonly certifications: readonly Certification[];
	readonly projects: readonly Project[];
	readonly skillGroups: readonly SkillGroup[];
}

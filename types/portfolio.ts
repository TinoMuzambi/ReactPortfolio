export interface Project {
	name?: string;
	shortname?: string;
	title: string;
	content: string[];
	link?: string | null;
	github?: string | null;
	keywords?: string[];
	image?: string | null;
	featured: boolean;
}

export interface AboutItem {
	title: string;
	image: string;
	text: string | null;
}

export interface TimelineItem {
	title: string;
	institution: string;
	period: string;
	description: string;
}

export interface ExperienceItem extends TimelineItem {
	icon: string;
}

export interface Tool {
	id: string | number;
	title: string;
	icon: string;
	link?: string | null;
}

export interface PortfolioData {
	projects: Project[];
	about: AboutItem[];
	education: TimelineItem[];
	experience: ExperienceItem[];
	tools: Tool[];
}

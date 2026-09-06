import { portfolio, selectedProjects } from "@/content/portfolio";
import { caseStudies } from "@/content/case-studies";

export const contentSnapshotDate = "2026-09-06";

export const resumePayload = {
	schemaVersion: "1.0",
	asOf: contentSnapshotDate,
	person: portfolio.profile,
	currentPosition: portfolio.experience[0],
	experience: portfolio.experience,
	education: portfolio.education,
	skills: portfolio.skillGroups,
	selectedProjects,
	resources: {
		allProjects: `${portfolio.profile.website}/projects.json`,
		plainTextGuide: `${portfolio.profile.website}/llms.txt`,
	},
} as const;

export const projectsPayload = {
	schemaVersion: "1.0",
	asOf: contentSnapshotDate,
	owner: portfolio.profile.name,
	count: portfolio.projects.length,
	projects: portfolio.projects,
	decisionFiles: caseStudies,
} as const;

export const personJsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": `${portfolio.profile.website}/#person`,
	name: portfolio.profile.name,
	url: portfolio.profile.website,
	image: `${portfolio.profile.website}/tino-muzambi.jpg`,
	jobTitle: portfolio.experience[0].role,
	description: portfolio.profile.summary,
	email: `mailto:${portfolio.profile.email}`,
	address: {
		"@type": "PostalAddress",
		addressLocality: "Cape Town",
		addressCountry: "ZA",
	},
	worksFor: {
		"@type": "Organization",
		name: portfolio.experience[0].organisation,
	},
	alumniOf: {
		"@type": "CollegeOrUniversity",
		name: "University of Cape Town",
	},
	sameAs: portfolio.profile.links.map((link) => link.href),
	knowsAbout: portfolio.skillGroups.flatMap((group) => group.items),
} as const;

import type { CaseStudy } from "@/types/case-study";
import type { Project } from "@/types/content";

const siteUrl = "https://tinomuzambi.com";

export const softwareSourceCodeJsonLd = (
	caseStudy: CaseStudy,
	project: Project
) => ({
	"@context": "https://schema.org",
	"@type": "SoftwareSourceCode",
	"@id": `${siteUrl}/work/${caseStudy.slug}/#software`,
	name: project.name,
	description: project.summary,
	url: `${siteUrl}/work/${caseStudy.slug}`,
	author: {
		"@type": "Person",
		"@id": `${siteUrl}/#person`,
		name: "Tino Muzambi",
	},
	codeRepository: project.sourceUrl,
	keywords: project.technologies,
	sameAs: caseStudy.links.map((link) => link.href),
});

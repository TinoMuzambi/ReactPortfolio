import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
	ProjectBrowser,
	SiteFooter,
	SiteHeader,
} from "@/components/decision-files";
import {
	caseStudies,
	getCaseStudy,
	getCaseStudyProject,
} from "@/content/case-studies";
import { softwareSourceCodeJsonLd } from "@/lib/project-schema";

interface WorkPageProps {
	readonly params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
	return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
	const { slug } = await params;
	const caseStudy = getCaseStudy(slug);
	if (!caseStudy) return {};
	const project = getCaseStudyProject(caseStudy);

	return {
		title: `${project.name} decision file`,
		description: caseStudy.statement,
		alternates: { canonical: `/work/${caseStudy.slug}` },
		openGraph: {
			type: "article",
			url: `/work/${caseStudy.slug}`,
			title: `${project.name} decision file`,
			description: project.summary,
		},
	};
}

export default async function WorkPage({ params }: WorkPageProps) {
	const { slug } = await params;
	const caseStudy = getCaseStudy(slug);
	if (!caseStudy) notFound();
	const project = getCaseStudyProject(caseStudy);
	const jsonLd = JSON.stringify(
		softwareSourceCodeJsonLd(caseStudy, project)
	).replace(/</g, "\\u003c");

	return (
		<>
			<a className="skip-link" href="#case-content">Skip to case sheet</a>
			<SiteHeader />
			<main className="work-route" id="case-content">
				<div className="page-shell route-intro">
					<Link className="back-link" href="/#work">Back to portfolio</Link>
					<p>Project evidence / {project.name}</p>
				</div>
				<section className="page-shell" aria-label={`${project.name} decision file`}>
					<ProjectBrowser activeSlug={caseStudy.slug} />
				</section>
			</main>
			<SiteFooter />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: jsonLd }}
			/>
		</>
	);
}

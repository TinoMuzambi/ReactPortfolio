import {
	ProfileBrief,
	ProjectBrowser,
	SiteFooter,
	SiteHeader,
	SupportingRecord,
} from "@/components/decision-files";
import { caseStudies, getCaseStudyProject } from "@/content/case-studies";
import { portfolio } from "@/content/portfolio";
import { softwareSourceCodeJsonLd } from "@/lib/project-schema";

export default function Home() {
	return (
		<>
			<a className="skip-link" href="#main-content">Skip to main content</a>
			<SiteHeader />
			<main id="main-content">
				<section className="intro page-shell" aria-labelledby="intro-title">
					<div className="intro-role">
						<p>{portfolio.profile.role}</p>
						<p>{portfolio.profile.location}</p>
					</div>
					<div>
						<h1 id="intro-title">Selected work, with the decisions left in.</h1>
						<p>
							A project-first view of the problems, constraints and public evidence behind
							Tino Muzambi&apos;s engineering work.
						</p>
					</div>
				</section>

				<section className="work-section page-shell" id="work" aria-labelledby="work-title">
					<header className="work-heading">
						<h2 id="work-title">Decision files</h2>
						<p>Four selected projects. Unknowns are marked rather than inferred.</p>
					</header>
					<ProjectBrowser activeSlug={caseStudies[0].slug} />
				</section>

				<SupportingRecord />
				<ProfileBrief />
			</main>
			<SiteFooter />
			{caseStudies.map((caseStudy) => {
				const project = getCaseStudyProject(caseStudy);
				const jsonLd = JSON.stringify(
					softwareSourceCodeJsonLd(caseStudy, project)
				).replace(/</g, "\\u003c");

				return (
					<script
						key={caseStudy.slug}
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: jsonLd }}
					/>
				);
			})}
		</>
	);
}

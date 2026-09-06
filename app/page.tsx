import Image from "next/image";
import Link from "next/link";

import EvidenceIndex from "@/components/EvidenceIndex";
import { portfolio } from "@/content/portfolio";
import type { EvidenceItem, EvidenceLink } from "@/lib/evidence";
import type { Experience, Project } from "@/types/content";

const primaryExperience = portfolio.experience.slice(0, 8);
const higherEducation = portfolio.education.slice(0, 3);

function findExperience(id: string): Experience {
	const entry = portfolio.experience.find((candidate) => candidate.id === id);
	if (!entry) throw new Error(`Missing experience entry: ${id}`);
	return entry;
}

function findProject(id: string): Project {
	const project = portfolio.projects.find((candidate) => candidate.id === id);
	if (!project) throw new Error(`Missing project: ${id}`);
	return project;
}

function projectLinks(project: Project): EvidenceLink[] {
	return [
		project.liveUrl ? { label: "Open project", href: project.liveUrl } : null,
		project.sourceUrl ? { label: "Read source", href: project.sourceUrl } : null,
		project.referenceUrl
			? { label: "Read documentation", href: project.referenceUrl }
			: null,
	].filter((link): link is EvidenceLink => link !== null);
}

const studentSupport = findExperience("uct-adp-web-developer");
const researchInfrastructure = findExperience("uct-web-developer");
const medicalPlatform = findExperience("four-minute-medicine-full-stack-developer");
const newsroomMigration = findExperience("varsity-newspaper-lead-developer");
const solutionsOperations = findExperience("vodacom-solutions-management-intern");
const clientDelivery = findExperience("elle-zeka-full-stack-developer");
const musicResearch = findProject("music-rec-path-signatures");
const advice = findProject("advice");
const clockAnalysis = findProject("clock-in-out");
const recomments = findProject("recomments");

const evidenceItems: readonly EvidenceItem[] = [
	{
		id: "uct-student-support",
		kind: "Product delivery",
		title: "Student support at UCT",
		source: `${studentSupport.role}, ${studentSupport.organisation}`,
		period: studentSupport.period,
		signal: "More than 5,000 students",
		summary: studentSupport.highlights[0],
		details: studentSupport.highlights.slice(1),
		relevantFor: ["full-stack", "leadership"],
		rank: { "full-stack": 1, data: 6, leadership: 3 },
	},
	{
		id: "medical-learning-platform",
		kind: "Production system",
		title: "Serverless medical education platform",
		source: `${medicalPlatform.role}, ${medicalPlatform.organisation}`,
		period: medicalPlatform.period,
		signal: "Next.js and AWS",
		summary: medicalPlatform.highlights[0],
		details: medicalPlatform.highlights.slice(1),
		relevantFor: ["full-stack"],
		rank: { "full-stack": 2, data: 7, leadership: 6 },
	},
	{
		id: advice.id,
		kind: "Selected project",
		title: advice.name,
		source: "Honours project and continued UCT work",
		period: "2021 – 2023",
		signal: "Curriculum, credits and chatbot",
		summary: advice.summary,
		details: [],
		technologies: advice.technologies,
		links: projectLinks(advice),
		relevantFor: ["full-stack", "data"],
		rank: { "full-stack": 3, data: 4, leadership: 7 },
	},
	{
		id: recomments.id,
		kind: "Selected project",
		title: recomments.name,
		source: "Independent full-stack product",
		period: "Public project",
		signal: "Sign-in, replies and notifications",
		summary: recomments.summary,
		details: [],
		technologies: recomments.technologies,
		links: projectLinks(recomments),
		relevantFor: ["full-stack"],
		rank: { "full-stack": 4, data: 8, leadership: 10 },
	},
	{
		id: "dsi-africa-infrastructure",
		kind: "Research infrastructure",
		title: "Web and data systems for DS-I Africa",
		source: `${researchInfrastructure.role}, ${researchInfrastructure.organisation}`,
		period: researchInfrastructure.period,
		signal: "More than 38 research projects",
		summary: researchInfrastructure.highlights[0],
		details: researchInfrastructure.highlights.slice(1),
		relevantFor: ["full-stack", "data", "leadership"],
		rank: { "full-stack": 5, data: 3, leadership: 2 },
	},
	{
		id: "client-web-delivery",
		kind: "Client delivery",
		title: "Web solutions for business clients",
		source: `${clientDelivery.role}, ${clientDelivery.organisation}`,
		period: clientDelivery.period,
		signal: "More than 15 solutions",
		summary: clientDelivery.highlights[0],
		details: clientDelivery.highlights.slice(1),
		relevantFor: ["full-stack"],
		rank: { "full-stack": 6, data: 10, leadership: 5 },
	},
	{
		id: musicResearch.id,
		kind: "Research engineering",
		title: musicResearch.name,
		source: "MSc Data Science research",
		period: "2024 – 2026",
		signal: "Tested Python pipeline",
		summary: musicResearch.summary,
		details: [],
		technologies: musicResearch.technologies,
		links: projectLinks(musicResearch),
		relevantFor: ["data"],
		rank: { "full-stack": 7, data: 1, leadership: 8 },
	},
	{
		id: clockAnalysis.id,
		kind: "Data analysis",
		title: clockAnalysis.name,
		source: "Independent analysis project",
		period: "Public project",
		signal: "End-to-end analysis",
		summary: clockAnalysis.summary,
		details: [],
		technologies: clockAnalysis.technologies,
		links: projectLinks(clockAnalysis),
		relevantFor: ["data"],
		rank: { "full-stack": 8, data: 2, leadership: 9 },
	},
	{
		id: "newsroom-migration",
		kind: "Technical leadership",
		title: "Newsroom platform migration",
		source: `${newsroomMigration.role}, ${newsroomMigration.organisation}`,
		period: newsroomMigration.period,
		signal: "Five-person team",
		summary: newsroomMigration.highlights[0],
		details: newsroomMigration.highlights.slice(1),
		relevantFor: ["full-stack", "leadership"],
		rank: { "full-stack": 9, data: 9, leadership: 1 },
	},
	{
		id: "solutions-and-training",
		kind: "Operations and teaching",
		title: "Feasibility assessment and cloud training",
		source: `${solutionsOperations.role}, ${solutionsOperations.organisation}`,
		period: solutionsOperations.period,
		signal: "1,000+ assessments",
		summary: solutionsOperations.highlights[0],
		details: solutionsOperations.highlights.slice(1),
		relevantFor: ["leadership"],
		rank: { "full-stack": 10, data: 5, leadership: 4 },
	},
] as const;

function TextLink({ href, children }: Readonly<{ href: string; children: string }>) {
	const external = href.startsWith("http");

	return (
		<a
			className="text-link"
			href={href}
			target={external ? "_blank" : undefined}
			rel={external ? "noreferrer" : undefined}
		>
			{children}
			{external ? <span className="sr-only"> (opens in a new tab)</span> : null}
		</a>
	);
}

export default function Home() {
	const currentRole = portfolio.experience[0];

	return (
		<>
			<a className="skip-link" href="#evidence">
				Skip to evidence
			</a>
			<header className="site-header">
				<div className="shell site-header-inner">
					<Link className="masthead" href="/" aria-label="Tino Muzambi, home">
						<span aria-hidden="true">TM</span>
						<span>Tino Muzambi</span>
					</Link>
					<nav aria-label="Primary navigation">
						<ul>
							<li><a href="#evidence">Evidence</a></li>
							<li><a href="#career">Career</a></li>
							<li><a href="#education">Education</a></li>
							<li><Link href="/contact">Contact</Link></li>
						</ul>
					</nav>
				</div>
			</header>

			<main className="shell portfolio-layout">
				<aside className="identity-rail" aria-labelledby="profile-name">
					<div className="identity-sticky">
						<div className="portrait">
							<Image
								priority
								src="/tino-muzambi.jpg"
								alt="Portrait of Tino Muzambi"
								width={1376}
								height={1376}
								sizes="(max-width: 720px) 88px, 120px"
							/>
						</div>
						<p className="profile-role">{portfolio.profile.role}</p>
						<h1 id="profile-name">{portfolio.profile.name}</h1>
						<p className="profile-headline">{portfolio.profile.headline}</p>

						<div className="current-role">
							<p><span aria-hidden="true" /> Current role</p>
							<strong>{currentRole.role}</strong>
							<span>{currentRole.organisation}</span>
							<small>{currentRole.period}</small>
						</div>

						<dl className="profile-facts">
							<div>
								<dt>Based in</dt>
								<dd>{portfolio.profile.location}</dd>
							</div>
							<div>
								<dt>Current study</dt>
								<dd>MSc Data Science, UCT</dd>
							</div>
						</dl>

						<div className="profile-links">
							<a href={`mailto:${portfolio.profile.email}`}>Email Tino</a>
							{portfolio.profile.links.map((link) => (
								<a key={link.label} href={link.href} target="_blank" rel="noreferrer">
									{link.label}<span className="sr-only"> (opens in a new tab)</span>
								</a>
							))}
						</div>
					</div>
				</aside>

				<div className="index-column">
					<section className="index-intro" id="evidence" aria-labelledby="evidence-title">
						<p>
							Tino is a Cape Town-based full-stack developer with experience across web
							platforms, serverless systems and research infrastructure. He is completing
							an MSc in Data Science at the University of Cape Town.
						</p>
						<div className="index-title-line">
							<h2 id="evidence-title">Selected evidence</h2>
							<span>{evidenceItems.length} records</span>
						</div>
						<p className="index-description">
							Choose the work you are hiring for. The same verified record stays visible;
							only its order and emphasis change.
						</p>
					</section>

					<EvidenceIndex items={evidenceItems} />

					<section className="record-section" id="career" aria-labelledby="career-title">
						<div className="record-heading">
							<h2 id="career-title">Career record</h2>
							<p>Eight recent roles, shown in reverse chronological order.</p>
						</div>
						<ol className="career-list">
							{primaryExperience.map((entry, index) => (
								<li key={entry.id}>
									<span className="career-period">{entry.period}</span>
									<div>
										<h3>{entry.role}</h3>
										<p>{entry.organisation}</p>
									</div>
									{index === 0 ? <span className="current-marker">Current</span> : null}
								</li>
							))}
						</ol>
						<p className="machine-note">
							The complete record and role highlights are available in the{" "}
							<TextLink href="/resume.json">machine-readable résumé</TextLink>.
						</p>
					</section>

					<section className="record-section" aria-labelledby="capabilities-title">
						<div className="record-heading">
							<h2 id="capabilities-title">Capabilities</h2>
							<p>Technologies used across professional, academic and independent work.</p>
						</div>
						<dl className="capability-index">
							{portfolio.skillGroups.map((group) => (
								<div key={group.label}>
									<dt>{group.label}</dt>
									<dd>{group.items.join(", ")}</dd>
								</div>
							))}
						</dl>
					</section>

					<section className="record-section" id="education" aria-labelledby="education-title">
						<div className="record-heading">
							<h2 id="education-title">Education</h2>
							<p>Computer science foundations and current postgraduate research.</p>
						</div>
						<div className="education-index">
							{higherEducation.map((item) => (
								<article key={item.id}>
									<p>{item.period}</p>
									<h3>{item.qualification}</h3>
									<span>{item.institution}</span>
									<ul>
										{item.details.map((detail) => <li key={detail}>{detail}</li>)}
									</ul>
								</article>
							))}
						</div>
					</section>

					<section className="contact-register" aria-labelledby="contact-title">
						<div>
							<h2 id="contact-title">Start a conversation</h2>
							<p>For roles, engineering collaboration or project enquiries.</p>
						</div>
						<a href={`mailto:${portfolio.profile.email}`}>{portfolio.profile.email}</a>
					</section>
				</div>
			</main>

			<footer className="site-footer">
				<div className="shell footer-inner">
					<p>© {new Date().getUTCFullYear()} {portfolio.profile.name}</p>
					<nav aria-label="Machine-readable resources">
						<ul>
							<li><Link href="/llms.txt">llms.txt</Link></li>
							<li><Link href="/resume.json">Résumé JSON</Link></li>
							<li><Link href="/projects.json">Projects JSON</Link></li>
						</ul>
					</nav>
				</div>
			</footer>
		</>
	);
}

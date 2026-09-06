import Image from "next/image";
import Link from "next/link";

import {
	caseStudies,
	getCaseStudy,
	getCaseStudyProject,
} from "@/content/case-studies";
import { portfolio } from "@/content/portfolio";
import type { CaseStudy } from "@/types/case-study";

export function ExternalLink({
	href,
	children,
}: Readonly<{ href: string; children: string }>) {
	return (
		<a className="evidence-link" href={href} target="_blank" rel="noreferrer">
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}

export function SiteHeader() {
	return (
		<header className="site-header">
			<div className="page-shell header-inner">
				<Link className="identity" href="/" aria-label="Tino Muzambi, home">
					<span>Tino Muzambi</span>
					<small>Full-stack developer</small>
				</Link>
				<nav aria-label="Primary navigation">
					<ul>
						<li><Link href="/#work">Selected work</Link></li>
						<li><Link href="/#record">Record</Link></li>
						<li><Link href="/contact">Contact</Link></li>
					</ul>
				</nav>
			</div>
		</header>
	);
}

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="page-shell footer-grid">
				<div>
					<p className="footer-name">{portfolio.profile.name}</p>
					<p>{portfolio.profile.location}</p>
				</div>
				<nav aria-label="Machine-readable resources">
					<p>For people and agents</p>
					<ul>
						<li><Link href="/llms.txt">llms.txt</Link></li>
						<li><Link href="/resume.json">Résumé JSON</Link></li>
						<li><Link href="/projects.json">Projects JSON</Link></li>
					</ul>
				</nav>
				<a className="footer-email" href={`mailto:${portfolio.profile.email}`}>
					{portfolio.profile.email}
				</a>
			</div>
		</footer>
	);
}

function ProjectIndex({ activeSlug }: Readonly<{ activeSlug: string }>) {
	return (
		<aside className="project-index" aria-label="Selected project index">
			<p className="index-intro">Choose a case sheet</p>
			<nav>
				<ul>
					{caseStudies.map((caseStudy) => {
						const project = getCaseStudyProject(caseStudy);
						const active = activeSlug === caseStudy.slug;

						return (
							<li key={caseStudy.slug}>
								<Link
									className="project-index-link"
									data-active={active ? "true" : undefined}
									aria-current={active ? "true" : undefined}
									href={`/work/${caseStudy.slug}`}
								>
									<span>{project.name}</span>
									<small>{project.technologies.slice(0, 2).join(" / ")}</small>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}

function DecisionPath({ caseStudy }: Readonly<{ caseStudy: CaseStudy }>) {
	return (
		<section className="decision-section" aria-labelledby="decision-path-title">
			<div className="case-section-heading">
				<h3 id="decision-path-title">Decision path</h3>
				<p>Claims stop where the public evidence stops.</p>
			</div>
			<ol className="decision-path">
				{caseStudy.traces.map((trace) => (
					<li key={trace.decision}>
						<div className="trace-marker" aria-hidden="true" />
						<div className="trace-step">
							<p className="trace-label">Constraint</p>
							<p>{trace.constraint}</p>
						</div>
						<div className="trace-step decision">
							<p className="trace-label">Decision</p>
							<p>{trace.decision}</p>
						</div>
						<div className="trace-step evidence">
							<p className="trace-label">Evidence</p>
							<p>{trace.evidence}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}

export function CaseSheet({ caseStudy }: Readonly<{ caseStudy: CaseStudy }>) {
	const project = getCaseStudyProject(caseStudy);

	return (
		<article className="case-sheet" aria-labelledby={`case-${caseStudy.slug}`}>
			<header className="case-header">
				<div className="case-title-row">
					<div>
						<p className="case-type">Project case sheet</p>
						<h2 id={`case-${caseStudy.slug}`}>{project.name}</h2>
					</div>
					<p className="case-id">{caseStudy.slug}</p>
				</div>
				<p className="case-statement">{caseStudy.statement}</p>
				<ul className="technology-list" aria-label={`${project.name} technologies`}>
					{project.technologies.map((technology) => (
						<li key={technology}>{technology}</li>
					))}
				</ul>
			</header>

			<section className="problem-block" aria-labelledby="problem-title">
				<p className="trace-label">Problem</p>
				<h3 id="problem-title">{caseStudy.problem}</h3>
			</section>

			<DecisionPath caseStudy={caseStudy} />

			<section className="evidence-register" aria-labelledby="evidence-register-title">
				<div>
					<h3 id="evidence-register-title">What is supported</h3>
					<ul>
						{caseStudy.evidence.map((item) => <li key={item}>{item}</li>)}
					</ul>
				</div>
				<div className="unknown-register">
					<h3>What remains unknown</h3>
					<ul>
						{caseStudy.unknowns.map((item) => <li key={item}>{item}</li>)}
					</ul>
				</div>
			</section>

			<footer className="case-footer">
				<p>{project.summary}</p>
				<div>
					{caseStudy.links.map((link) => (
						<ExternalLink href={link.href} key={link.href}>{link.label}</ExternalLink>
					))}
				</div>
			</footer>
		</article>
	);
}

export function ProjectBrowser({ activeSlug }: Readonly<{ activeSlug: string }>) {
	const caseStudy = getCaseStudy(activeSlug);

	if (!caseStudy) throw new Error(`Unknown selected project: ${activeSlug}`);

	return (
		<div className="project-browser">
			<ProjectIndex activeSlug={activeSlug} />
			<CaseSheet caseStudy={caseStudy} />
		</div>
	);
}

export function SupportingRecord() {
	const experience = portfolio.experience.slice(0, 6);
	const education = portfolio.education.slice(0, 3);

	return (
		<section className="record-section" id="record" aria-labelledby="record-title">
			<div className="page-shell">
				<header className="record-heading">
					<h2 id="record-title">Supporting record</h2>
					<p>Roles and education behind the selected decisions.</p>
				</header>
				<div className="record-columns">
					<section aria-labelledby="experience-title">
						<h3 id="experience-title">Experience</h3>
						<div className="record-list">
							{experience.map((entry) => (
								<article key={entry.id}>
									<p className="record-period">{entry.period}</p>
									<h4>{entry.role}</h4>
									<p>{entry.organisation}</p>
									{entry.highlights.length > 0 ? (
										<details>
											<summary>Review evidence</summary>
											<ul>{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
										</details>
									) : <p className="unknown-copy">Public detail not stated.</p>}
								</article>
							))}
						</div>
					</section>
					<section aria-labelledby="education-title">
						<h3 id="education-title">Education</h3>
						<div className="record-list education-record">
							{education.map((item) => (
								<article key={item.id}>
									<p className="record-period">{item.period}</p>
									<h4>{item.qualification}</h4>
									<p>{item.institution}</p>
									<ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
								</article>
							))}
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}

export function ProfileBrief() {
	return (
		<section className="profile-brief" aria-labelledby="profile-title">
			<div className="page-shell profile-grid">
				<Image
					loading="eager"
					src="/tino-muzambi.jpg"
					alt="Portrait of Tino Muzambi"
					width={1376}
					height={1376}
					sizes="(max-width: 680px) 42vw, 220px"
				/>
				<div>
					<p className="case-type">Profile</p>
					<h2 id="profile-title">{portfolio.profile.name}</h2>
					<p className="profile-summary">{portfolio.profile.summary}</p>
					<dl>
						{portfolio.skillGroups.map((group) => (
							<div key={group.label}>
								<dt>{group.label}</dt>
								<dd>{group.items.join(", ")}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}

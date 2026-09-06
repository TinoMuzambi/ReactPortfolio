import Link from "next/link";
import type { ReactNode } from "react";

import { portfolio, selectedProjects } from "@/content/portfolio";

const visibleExperience = portfolio.experience.slice(0, 7);
const higherEducation = portfolio.education.slice(0, 3);

function ExternalLink({
	href,
	children,
	identity = false,
}: Readonly<{ href: string; children: string; identity?: boolean }>) {
	return (
		<a href={href} target="_blank" rel={identity ? "me noreferrer" : "noreferrer"}>
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}

function Source({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<details className="source-disclosure">
			<summary>Show source</summary>
			<div>{children}</div>
		</details>
	);
}

export default function Home() {
	const currentRole = portfolio.experience[0];
	const currentStudy = portfolio.education[0];

	return (
		<>
			<a className="skip-link" href="#main-content">Skip to main content</a>

			<aside className="name-spine" aria-hidden="true">
				<span>Tino Muzambi</span>
			</aside>

			<header className="mobile-header">
				<Link href="/">Tino Muzambi</Link>
				<a href={`mailto:${portfolio.profile.email}`}>Email</a>
			</header>

			<aside className="action-rail" aria-label="Contact and profile links">
				<p>Let’s talk</p>
				<a href={`mailto:${portfolio.profile.email}`}>Email</a>
				<ExternalLink href="https://github.com/TinoMuzambi" identity>GitHub</ExternalLink>
				<ExternalLink href="https://linkedin.com/in/tinomuzambi" identity>LinkedIn</ExternalLink>
				<Link href="/resume.json">Résumé</Link>
			</aside>

			<main className="profile-main" id="main-content">
				<section className="answer-section opening-answer" aria-labelledby="current-question">
					<p className="short-answer">{portfolio.profile.location}</p>
					<h1 className="sr-only">{portfolio.profile.name}</h1>
					<h2 id="current-question">What is Tino doing now?</h2>
					<p className="answer-lead">
						{currentRole.role} at {currentRole.organisation}. His broader public record
						spans full-stack product engineering and applied data.
					</p>
					<div className="current-facts">
						<div>
							<p>Current role</p>
							<strong>{currentRole.role}</strong>
							<span>{currentRole.organisation} · {currentRole.period}</span>
						</div>
						<div>
							<p>Current study record</p>
							<strong>{currentStudy.qualification}</strong>
							<span>{currentStudy.institution} · {currentStudy.period}</span>
						</div>
					</div>
					<Source>
						<p>
							These titles and dates come from Tino’s public portfolio record. The OVEX
							role has no public project details, so this design does not infer them.
						</p>
					</Source>
				</section>

				<section className="answer-section" aria-labelledby="impact-question">
					<p className="short-answer">Selected outcomes</p>
					<h2 id="impact-question">Which work changed something?</h2>
					<div className="outcome-list">
						<article>
							<strong>5,000+</strong>
							<h3>students served</h3>
							<p>A personalised Next.js support dashboard for UCT Commerce students.</p>
							<Source><p>UCT Academic Development Programme role, December 2021–December 2023.</p></Source>
						</article>
						<article>
							<strong>38+</strong>
							<h3>research projects aligned</h3>
							<p>Data standards developed through the DS-I Africa working group.</p>
							<Source><p>University of Cape Town Web Developer role, February 2023–May 2025.</p></Source>
						</article>
						<article>
							<strong>50+</strong>
							<h3>cloud learners supported</h3>
							<p>AWS re/Start training co-facilitated during a Vodacom internship.</p>
							<Source><p>Vodacom Solutions Management internship, February 2022–February 2023.</p></Source>
						</article>
					</div>
					<p className="evidence-caveat">
						These figures are self-published portfolio claims and should be confirmed
						during a hiring process.
					</p>
				</section>

				<section className="answer-section" id="work" aria-labelledby="work-question">
					<p className="short-answer">Public evidence</p>
					<h2 id="work-question">Where can I inspect the work?</h2>
					<div className="work-list">
						{selectedProjects.map((project) => (
							<article id={project.id} key={project.id}>
								<div className="work-heading">
									<h3>{project.name}</h3>
									<p>{project.technologies.slice(0, 4).join(" · ")}</p>
								</div>
								<p>{project.summary}</p>
								<div className="work-links">
									{project.sourceUrl ? <ExternalLink href={project.sourceUrl}>Source code</ExternalLink> : null}
									{project.liveUrl ? <ExternalLink href={project.liveUrl}>Live project</ExternalLink> : null}
									{project.referenceUrl ? <ExternalLink href={project.referenceUrl}>Reference</ExternalLink> : null}
								</div>
							</article>
						))}
					</div>
					<p className="section-tail">
						All {portfolio.projects.length} projects are indexed in <Link href="/projects.json">projects.json</Link>.
					</p>
				</section>

				<section className="answer-section" aria-labelledby="build-question">
					<p className="short-answer">Capabilities with context</p>
					<h2 id="build-question">How does he build?</h2>
					<div className="capability-list">
						{portfolio.skillGroups.map((group) => (
							<article key={group.label}>
								<h3>{group.label}</h3>
								<p>{group.items.join(", ")}</p>
								<Source>
									<p>
										This is a self-published skills inventory. The selected work above provides
										inspectable evidence for current tools; confirm the recency of other items.
									</p>
								</Source>
							</article>
						))}
					</div>
				</section>

				<section className="answer-section" id="experience" aria-labelledby="experience-question">
					<p className="short-answer">Professional chronology</p>
					<h2 id="experience-question">Where has he worked?</h2>
					<ol className="role-list">
						{visibleExperience.map((entry) => (
							<li key={entry.id}>
								<div>
									<h3>{entry.role}</h3>
									<p>{entry.organisation}</p>
								</div>
								<time>{entry.period}</time>
								{entry.highlights.length ? (
									<Source><ul>{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul></Source>
								) : <p className="no-detail">No public project detail is listed.</p>}
							</li>
						))}
					</ol>
					<p className="section-tail">The full record is available in <Link href="/resume.json">résumé JSON</Link>.</p>
				</section>

				<section className="answer-section" id="education" aria-labelledby="education-question">
					<p className="short-answer">Education</p>
					<h2 id="education-question">What has he studied?</h2>
					<div className="study-list">
						{higherEducation.map((item) => (
							<article key={item.id}>
								<time>{item.period}</time>
								<h3>{item.qualification}</h3>
								<p>{item.institution}</p>
								<Source><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></Source>
							</article>
						))}
					</div>
				</section>

				<section className="answer-section machine-answer" aria-labelledby="machine-question">
					<p className="short-answer">For agents and ATS tools</p>
					<h2 id="machine-question">Can a machine read this?</h2>
					<p className="answer-lead">
						Yes. The same canonical content is published as plain text, JSON and semantic
						HTML, with Person structured data and stable URLs.
					</p>
					<nav aria-label="Machine-readable portfolio resources">
						<Link href="/llms.txt">llms.txt</Link>
						<Link href="/resume.json">Résumé JSON</Link>
						<Link href="/projects.json">Projects JSON</Link>
						<Link href="/sitemap.xml">Sitemap</Link>
					</nav>
				</section>

				<section className="answer-section contact-answer" aria-labelledby="contact-question">
					<p className="short-answer">Direct contact</p>
					<h2 id="contact-question">What is the next step?</h2>
					<p className="answer-lead">Send the role, problem or collaboration brief.</p>
					<a className="large-email" href={`mailto:${portfolio.profile.email}`}>{portfolio.profile.email}</a>
				</section>
			</main>

			<footer className="plain-footer">
				<p>© {new Date().getUTCFullYear()} {portfolio.profile.name}</p>
				<p>Built with Next.js, TypeScript and Tailwind CSS.</p>
			</footer>
		</>
	);
}

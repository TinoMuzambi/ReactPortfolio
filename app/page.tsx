import Image from "next/image";
import Link from "next/link";

import { portfolio, selectedProjects } from "@/content/portfolio";

const visibleExperience = portfolio.experience.slice(0, 6);
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

export default function Home() {
	const currentRole = portfolio.experience[0];
	const researchProject = selectedProjects[0];

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
				<ExternalLink href="https://projects.tinomuzambi.com">Projects</ExternalLink>
				<Link href="/resume.json">Résumé</Link>
			</aside>

			<main className="profile-main" id="main-content">
				<section className="answer-section opening-answer" aria-labelledby="intro-title">
					<div className="opening-grid">
						<div className="opening-copy">
							<p className="short-answer">{portfolio.profile.location}</p>
							<h1 id="intro-title">Software systems, studied closely.</h1>
							<p className="answer-lead">
								I’m {portfolio.profile.name}, a full-stack developer with strong software
								foundations and fluent AI-assisted delivery.
							</p>
							<div className="intro-status" aria-label="Current professional and academic status">
								<p><span>Now</span>{currentRole.role} at {currentRole.organisation}</p>
								<p><span>Completed</span>MSc Data Science at the University of Cape Town</p>
							</div>
							<div className="intro-links" aria-label="Profile links">
								<a className="primary-link" href="#work">Review selected work</a>
								<ExternalLink href="https://github.com/TinoMuzambi" identity>GitHub</ExternalLink>
								<ExternalLink href="https://linkedin.com/in/tinomuzambi" identity>LinkedIn</ExternalLink>
								<ExternalLink href="https://projects.tinomuzambi.com">Projects</ExternalLink>
							</div>
						</div>

						<div className="portrait-card">
							<Image
								priority
								src="/tino-muzambi-graduation.png"
								alt="Portrait of Tino Muzambi in graduation attire"
								width={1254}
								height={1254}
								sizes="(max-width: 700px) calc(100vw - 2.5rem), (max-width: 1200px) 34vw, 430px"
							/>
						</div>
					</div>
				</section>

				<section className="answer-section" id="work" aria-labelledby="work-question">
					<p className="short-answer">Selected public work</p>
					<h2 id="work-question">What have I built and analysed?</h2>
					<div className="work-list">
						{selectedProjects.map((project) => (
							<article id={project.id} key={project.id}>
								<div className="work-heading">
									<h3 aria-label={project.name}>
										{project.id === researchProject.id ? (
											<>MusicRec<wbr />Path<wbr />Signatures</>
										) : project.name}
									</h3>
									<p>{project.technologies.slice(0, 5).join(" · ")}</p>
								</div>
								<div className="work-detail">
									<p>{project.summary}</p>
									{project.id === researchProject.id ? (
										<p className="project-context">
											MSc Data Science research completed in 2026 with a distinction in the coursework component.
										</p>
									) : null}
									<div className="work-links">
										{project.sourceUrl ? <ExternalLink href={project.sourceUrl}>Source code</ExternalLink> : null}
										{project.liveUrl ? <ExternalLink href={project.liveUrl}>Open project</ExternalLink> : null}
										{project.referenceUrl ? <ExternalLink href={project.referenceUrl}>Documentation</ExternalLink> : null}
									</div>
								</div>
							</article>
						))}
					</div>
					<p className="section-tail">
						For the wider archive of experiments, tutorials and earlier builds, visit{" "}
						<ExternalLink href="https://projects.tinomuzambi.com">projects.tinomuzambi.com</ExternalLink>.
						All {portfolio.projects.length} public projects are also indexed in <Link href="/projects.json">projects.json</Link>.
					</p>
				</section>

				<section className="answer-section" id="experience" aria-labelledby="experience-question">
					<p className="short-answer">Professional experience</p>
					<h2 id="experience-question">Where have I applied this work?</h2>
					<ol className="role-list">
						{visibleExperience.map((entry) => (
							<li key={entry.id}>
								<div className="role-heading">
									<div>
										<h3>{entry.role}</h3>
										<p>{entry.organisation}</p>
									</div>
									<time>{entry.period}</time>
								</div>
								<ul>{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
							</li>
						))}
					</ol>
					<p className="section-tail">The complete chronology is available in <Link href="/resume.json">résumé JSON</Link>.</p>
				</section>

				<section className="answer-section methods-answer" aria-labelledby="build-question">
					<p className="short-answer">Working methods</p>
					<h2 id="build-question">How do I work?</h2>
					<div className="practice-list">
						<article>
							<h3>AI-assisted engineering</h3>
							<div>
								<p>
									I use Claude Code and Codex throughout software delivery. They help me
									understand repositories, plan changes, implement and refactor features,
									generate tests, review diffs and document work.
								</p>
								<p>
									My proficiency is in directing agentic coding workflows, not accepting output
									unchecked. I set constraints, keep work scoped, inspect changes and verify
									behaviour before treating a task as complete.
								</p>
							</div>
						</article>
						<article>
							<h3>Home server operations</h3>
							<div>
								<p>I run and maintain a home server as a practical systems lab.</p>
								<ul>
									<li>Deploying and maintaining self-hosted services</li>
									<li>Managing local networking and remote access</li>
									<li>Planning storage, backups and recovery</li>
									<li>Monitoring health, applying updates and troubleshooting failures</li>
								</ul>
							</div>
						</article>
					</div>
					<div className="capability-list">
						{portfolio.skillGroups.map((group) => (
							<article key={group.label}>
								<h3>{group.label}</h3>
								<p>{group.items.join(", ")}</p>
							</article>
						))}
					</div>
				</section>

				<section className="answer-section" id="education" aria-labelledby="education-question">
					<p className="short-answer">Academic record</p>
					<h2 id="education-question">What have I studied?</h2>
					<div className="study-list">
						{higherEducation.map((item) => (
							<article key={item.id}>
								<time>{item.period}</time>
								<h3>{item.qualification}</h3>
								<p>{item.institution}</p>
								<ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
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
					<h2 id="contact-question">What should we talk about next?</h2>
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

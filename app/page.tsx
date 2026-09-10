import Image from "next/image";
import Link from "next/link";

import { portfolio, selectedProjects } from "@/content/portfolio";

const visibleExperience = portfolio.experience.slice(0, 6);
const higherEducation = portfolio.education.slice(0, 3);
const workingToolkit = [
	{ name: "React", src: "/tools/react.webp" },
	{ name: "Next.js", src: "/tools/nextjs.svg" },
	{ name: "TypeScript", src: "/tools/typescript.png" },
	{ name: "Claude Code", src: "/tools/claude.svg" },
	{ name: "Codex", src: "/tools/codex.svg" },
	{ name: "Python", src: "/tools/python.png" },
	{ name: "Git", src: "/tools/git.png" },
	{ name: "AWS", src: "/tools/aws.svg" },
	{ name: "Azure", src: "/tools/azure.svg" },
	{ name: "GCP", src: "/tools/gcp.svg" },
	{ name: "React Native", src: "/tools/react.webp" },
	{ name: "R", src: "/tools/r.svg" },
] as const;

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

			<header className="mobile-header">
				<Link href="/">Tino Muzambi</Link>
				<nav aria-label="Mobile profile links">
					<ExternalLink href="/tinotenda-muzambi-cv.pdf">CV</ExternalLink>
					<a href={`mailto:${portfolio.profile.email}`}>Email</a>
				</nav>
			</header>

			<aside className="action-rail" aria-label="Contact and profile links">
				<p>Let’s talk</p>
				<a href={`mailto:${portfolio.profile.email}`}>Email</a>
				<ExternalLink href="https://github.com/TinoMuzambi" identity>GitHub</ExternalLink>
				<ExternalLink href="https://linkedin.com/in/tinomuzambi" identity>LinkedIn</ExternalLink>
				<ExternalLink href="https://projects.tinomuzambi.com">Projects</ExternalLink>
				<ExternalLink href="/tinotenda-muzambi-cv.pdf">CV</ExternalLink>
			</aside>

			<main className="profile-main" id="main-content">
				<section className="answer-section opening-answer" aria-labelledby="intro-title">
					<div className="opening-grid">
						<div className="opening-copy">
							<h1 id="intro-title">Software systems, studied closely.</h1>
							<p className="answer-lead">
								I’m {portfolio.profile.name}, a full-stack developer based in Cape Town with
								more than five years of experience, strong software foundations and fluent
								AI-assisted delivery.
							</p>
							<div className="intro-status" aria-label="Current professional and academic status">
								<p><span>Now</span>{currentRole.role} at {currentRole.organisation}</p>
								<p><span>Completed</span>MSc Data Science at the University of Cape Town</p>
							</div>
							<div className="intro-links" aria-label="Profile links">
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
								fill
								sizes="(max-width: 740px) 100vw, (max-width: 1080px) 44vw, 38vw"
							/>
						</div>
					</div>
				</section>

				<section className="answer-section" id="work" aria-labelledby="work-question">
					<h2 id="work-question">Selected public work</h2>
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
					<h2 id="experience-question">Professional experience</h2>
					<div className="role-list">
						{visibleExperience.map((entry) => (
							<article key={entry.id}>
								<div className="role-heading">
									<div>
										<h3>{entry.role}</h3>
										<p>{entry.organisation}</p>
									</div>
									<time>{entry.period}</time>
								</div>
								<ul>{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
							</article>
						))}
					</div>
					<p className="section-tail">The complete chronology is available in <Link href="/cv.json">CV JSON</Link>.</p>
				</section>

				<section className="answer-section methods-answer" aria-labelledby="build-question">
					<h2 id="build-question">Working methods</h2>
					<div className="method-stories">
						<article>
							<div className="method-intro">
								<h3>AI-assisted engineering</h3>
								<p>
									My software foundations predate today’s AI tools. That experience lets me
									use Claude Code, Codex and local language models with useful context, clear
									constraints and informed review.
								</p>
							</div>
							<ul>
								<li>Repository analysis and task planning</li>
								<li>Implementation, refactoring and test generation</li>
								<li>Prompt and context engineering with explicit human validation</li>
								<li>Diff review, behavioural verification and documentation</li>
							</ul>
						</article>
						<article>
							<div className="method-intro">
								<h3>Home server operations</h3>
								<p>I run and maintain a home server as a practical systems lab.</p>
							</div>
							<ul>
								<li>Running containerised services with Docker Compose</li>
								<li>Routing services with Traefik, HTTPS and SSO</li>
								<li>Managing networking, remote access, storage, backups and recovery</li>
								<li>Monitoring health, applying updates and troubleshooting failures</li>
							</ul>
						</article>
					</div>
					<div className="toolkit">
						<div className="toolkit-heading">
							<h3>A working toolkit</h3>
							<p>Familiar tools, chosen to fit the work rather than lead it.</p>
						</div>
						<ul className="toolkit-logo-list" aria-label="Frequently used tools and technologies">
							{workingToolkit.map((tool) => (
								<li key={tool.name}>
									<Image src={tool.src} alt="" width={56} height={56} loading="eager" />
									<span>{tool.name}</span>
								</li>
							))}
						</ul>
						<ul className="credential-list" aria-label="Cloud certifications">
							{portfolio.certifications.map((certification) => (
								<li key={certification.id}>{certification.name}</li>
							))}
						</ul>
						<p className="toolkit-note">The broader inventory is available in <Link href="/cv.json">CV JSON</Link>.</p>
					</div>
				</section>

				<section className="answer-section" id="education" aria-labelledby="education-question">
					<h2 id="education-question">Education</h2>
					<div className="study-list">
						{higherEducation.map((item) => (
							<article key={item.id}>
								<div className="study-heading">
									<time>{item.period}</time>
									<h3>{item.qualification}</h3>
									<p>{item.institution}</p>
								</div>
								<ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
							</article>
						))}
					</div>
				</section>

				<section className="answer-section contact-answer" aria-labelledby="contact-question">
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

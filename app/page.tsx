import Image from "next/image";
import Link from "next/link";

import { portfolio, selectedProjects } from "@/content/portfolio";

const primaryExperience = portfolio.experience.slice(0, 8);
const higherEducation = portfolio.education.slice(0, 3);

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
	return (
		<>
			<a className="skip-link" href="#main-content">
				Skip to main content
			</a>
			<header className="site-header">
				<div className="shell flex items-center justify-between gap-6 py-5">
					<Link className="wordmark" href="/" aria-label="Tino Muzambi, home">
						TM
					</Link>
					<nav aria-label="Primary navigation">
						<ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm">
							<li>
								<a href="#experience">Experience</a>
							</li>
							<li>
								<a href="#work">Work</a>
							</li>
							<li>
								<a href="#education">Education</a>
							</li>
							<li>
								<Link href="/contact">Contact</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<main id="main-content">
				<section className="shell hero" aria-labelledby="intro-title">
					<div className="hero-copy">
						<p className="role-line">{portfolio.profile.role}</p>
						<h1 id="intro-title">{portfolio.profile.name}</h1>
						<p className="hero-headline">{portfolio.profile.headline}</p>
						<p className="hero-summary">{portfolio.profile.summary}</p>
						<div className="flex flex-wrap gap-x-5 gap-y-3">
							<TextLink href={`mailto:${portfolio.profile.email}`}>Email Tino</TextLink>
							{portfolio.profile.links.map((link) => (
								<TextLink href={link.href} key={link.label}>
									{link.label}
								</TextLink>
							))}
						</div>
					</div>

					<figure className="portrait-frame">
						<Image
							priority
							src="/tino-muzambi.jpg"
							alt="Portrait of Tino Muzambi"
							width={1376}
							height={1376}
							sizes="(max-width: 768px) 45vw, 280px"
						/>
						<figcaption>{portfolio.profile.location}</figcaption>
					</figure>
				</section>

				<section className="shell section" id="experience" aria-labelledby="experience-title">
					<div className="section-heading">
						<h2 id="experience-title">Experience</h2>
						<p>A chronological record of product delivery, technical leadership and teaching.</p>
					</div>
					<ol className="timeline">
						{primaryExperience.map((entry) => (
							<li key={entry.id}>
								<div className="timeline-date">{entry.period}</div>
								<article>
									<h3>{entry.role}</h3>
									<p className="organisation">{entry.organisation}</p>
									{entry.highlights.length > 0 ? (
										<ul>
											{entry.highlights.map((highlight) => (
												<li key={highlight}>{highlight}</li>
											))}
										</ul>
									) : null}
								</article>
							</li>
						))}
					</ol>
					<p className="machine-note">
						The complete timeline is available in the <TextLink href="/resume.json">machine-readable résumé</TextLink>.
					</p>
				</section>

				<section className="shell section" id="work" aria-labelledby="work-title">
					<div className="section-heading">
						<h2 id="work-title">Selected work</h2>
						<p>Projects spanning full-stack products, applied machine learning and data analysis.</p>
					</div>
					<div className="project-list">
						{selectedProjects.map((project) => (
							<article className="project" key={project.id}>
								<div>
									<h3>{project.name}</h3>
									<p>{project.summary}</p>
								</div>
								<ul className="technology-list" aria-label={`${project.name} technologies`}>
									{project.technologies.map((technology) => (
										<li key={technology}>{technology}</li>
									))}
								</ul>
								<div className="project-links">
									{project.liveUrl ? <TextLink href={project.liveUrl}>View project</TextLink> : null}
									{project.sourceUrl ? <TextLink href={project.sourceUrl}>Source code</TextLink> : null}
									{project.referenceUrl ? <TextLink href={project.referenceUrl}>Documentation</TextLink> : null}
								</div>
							</article>
						))}
					</div>
					<p className="machine-note">
						Browse all {portfolio.projects.length} projects in <TextLink href="/projects.json">structured JSON</TextLink>.
					</p>
				</section>

				<section className="shell section" aria-labelledby="capabilities-title">
					<div className="section-heading">
						<h2 id="capabilities-title">Capabilities</h2>
						<p>An inventory of technologies used across professional, academic and personal work.</p>
					</div>
					<dl className="capabilities">
						{portfolio.skillGroups.map((group) => (
							<div key={group.label}>
								<dt>{group.label}</dt>
								<dd>{group.items.join(", ")}</dd>
							</div>
						))}
					</dl>
				</section>

				<section className="shell section" id="education" aria-labelledby="education-title">
					<div className="section-heading">
						<h2 id="education-title">Education</h2>
						<p>Computer science foundations with current postgraduate work in data science.</p>
					</div>
					<div className="education-list">
						{higherEducation.map((item) => (
							<article key={item.id}>
								<p className="education-date">{item.period}</p>
								<h3>{item.qualification}</h3>
								<p className="organisation">{item.institution}</p>
								<ul>
									{item.details.map((detail) => (
										<li key={detail}>{detail}</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</section>

				<section className="contact-strip" aria-labelledby="contact-title">
					<div className="shell contact-inner">
						<div>
							<h2 id="contact-title">Start a conversation</h2>
							<p>The most reliable way to reach Tino is email.</p>
						</div>
						<a className="contact-link" href={`mailto:${portfolio.profile.email}`}>
							{portfolio.profile.email}
						</a>
					</div>
				</section>
			</main>

			<footer className="site-footer">
				<div className="shell flex flex-wrap items-center justify-between gap-4 py-8 text-sm">
					<p>© {new Date().getUTCFullYear()} {portfolio.profile.name}</p>
					<nav aria-label="Machine-readable resources">
						<ul className="flex flex-wrap gap-5">
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

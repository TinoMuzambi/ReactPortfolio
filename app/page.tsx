import Image from "next/image";
import Link from "next/link";

import { portfolio, selectedProjects } from "@/content/portfolio";

const recentExperience = portfolio.experience.slice(0, 6);
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

function SectionMark({ children }: Readonly<{ children: string }>) {
	return <p className="section-mark">{children}</p>;
}

export default function Home() {
	return (
		<>
			<a className="skip-link" href="#main-content">
				Skip to main content
			</a>

			<header className="notebook-header">
				<div className="page-shell header-inner">
					<Link className="author-mark" href="/" aria-label="Tino Muzambi, home">
						Tino Muzambi
					</Link>
					<nav aria-label="Primary navigation">
						<a href="#research">Research</a>
						<a href="#work">Work</a>
						<a href="#experience">Experience</a>
						<Link href="/contact">Contact</Link>
					</nav>
				</div>
			</header>

			<main id="main-content">
				<section className="page-shell intro-grid" aria-labelledby="intro-title">
					<aside className="author-card" aria-label="Profile summary">
						<Image
							priority
							src="/tino-muzambi.jpg"
							alt="Portrait of Tino Muzambi"
							width={1376}
							height={1376}
							sizes="112px"
						/>
						<p>{portfolio.profile.role}</p>
						<address>{portfolio.profile.location}</address>
					</aside>

					<div className="intro-copy">
						<h1 id="intro-title">Software systems, studied closely.</h1>
						<p className="intro-deck">
							I’m {portfolio.profile.name}, a full-stack developer working where product
							engineering and applied data meet.
						</p>
						<p className="intro-summary">
							I build useful web platforms with TypeScript and Next.js, and I study how
							data-driven systems can be evaluated more carefully with Python and R.
						</p>
						<div className="intro-links" aria-label="Profile links">
							<a className="primary-link" href="#work">Review selected work</a>
							<ExternalLink href="https://github.com/TinoMuzambi" identity>GitHub</ExternalLink>
							<ExternalLink href="https://linkedin.com/in/tinomuzambi" identity>LinkedIn</ExternalLink>
							<a href={`mailto:${portfolio.profile.email}`}>Email</a>
						</div>
					</div>
				</section>

				<section className="signal-band" aria-labelledby="signal-title">
					<div className="page-shell signal-layout">
						<div className="signal-copy">
							<h2 id="signal-title">The same work, viewed through two lenses</h2>
							<p>
								Production engineering asks whether a system is useful and dependable.
								Data work asks what it measures, misses and changes. I work across both.
							</p>
						</div>
						<figure className="signal-figure">
							<svg viewBox="0 0 760 270" role="img" aria-labelledby="path-title path-description">
								<title id="path-title">A path between software systems and applied data</title>
								<desc id="path-description">
									Two paths cross at selected projects, current research and professional delivery.
								</desc>
								<path className="grid-path" d="M20 55H740M20 135H740M20 215H740" />
								<path className="signal-path signal-path-product" d="M20 205 C140 198 162 72 280 86 S438 232 545 178 S640 62 740 70" />
								<path className="signal-path signal-path-data" d="M20 86 C118 80 175 220 290 203 S422 72 530 102 S642 220 740 186" />
								<g className="signal-nodes">
									<circle cx="280" cy="86" r="8" />
									<circle cx="290" cy="203" r="8" />
									<circle cx="535" cy="140" r="11" />
								</g>
							</svg>
							<figcaption>
								<span>Product systems</span>
								<span>Shared decisions</span>
								<span>Applied data</span>
							</figcaption>
						</figure>
					</div>
				</section>

				<section className="page-shell notebook-section" id="research" aria-labelledby="research-title">
					<aside>
						<SectionMark>Current inquiry</SectionMark>
						<p className="margin-note">MSc Data Science<br />University of Cape Town<br />2024–2026</p>
					</aside>
					<article className="reading-column">
						<h2 id="research-title">What am I investigating now?</h2>
						<p className="lead-paragraph">
							Fair and explainable music recommendation: how path signatures and a
							reproducible evaluation pipeline can help examine ranking quality, diversity
							and bias.
						</p>
						<div className="research-record">
							<div>
								<h3>MusicRecPathSignatures</h3>
								<p>{selectedProjects[0].summary}</p>
							</div>
							<dl>
								<div><dt>Methods</dt><dd>Path signatures, ranking and diversity metrics</dd></div>
								<div><dt>Delivery</dt><dd>Tests and a fail-closed evaluation pipeline</dd></div>
								<div><dt>Primary tools</dt><dd>{selectedProjects[0].technologies.join(", ")}</dd></div>
							</dl>
							{selectedProjects[0].sourceUrl ? (
								<ExternalLink href={selectedProjects[0].sourceUrl}>Read the research repository</ExternalLink>
							) : null}
						</div>
					</article>
				</section>

				<section className="page-shell notebook-section" id="work" aria-labelledby="work-title">
					<aside>
						<SectionMark>Selected evidence</SectionMark>
						<p className="margin-note">Four public projects<br />Source and references linked<br />No proficiency scores</p>
					</aside>
					<div className="reading-column">
						<h2 id="work-title">What have I built and analysed?</h2>
						<div className="project-plates">
							{selectedProjects.slice(1).map((project, index) => (
								<article className="project-plate" key={project.id}>
									<p className="project-reference">Field note {index + 1}</p>
									<h3>{project.name}</h3>
									<p>{project.summary}</p>
									<dl>
										<dt>Built with</dt>
										<dd>{project.technologies.join(", ")}</dd>
									</dl>
									<div className="record-links">
										{project.liveUrl ? <ExternalLink href={project.liveUrl}>Open project</ExternalLink> : null}
										{project.sourceUrl ? <ExternalLink href={project.sourceUrl}>Review source</ExternalLink> : null}
										{project.referenceUrl ? <ExternalLink href={project.referenceUrl}>Read documentation</ExternalLink> : null}
									</div>
								</article>
							))}
						</div>
						<p className="machine-link">
							The complete catalogue is available as <Link href="/projects.json">structured project data</Link>.
						</p>
					</div>
				</section>

				<section className="page-shell notebook-section" id="experience" aria-labelledby="experience-title">
					<aside>
						<SectionMark>Professional record</SectionMark>
						<p className="margin-note">Current role first<br />Evidence kept verbatim<br />Full history in résumé JSON</p>
					</aside>
					<div className="reading-column">
						<h2 id="experience-title">Where have I applied this work?</h2>
						<ol className="experience-records">
							{recentExperience.map((entry) => (
								<li key={entry.id}>
									<div className="experience-heading">
										<div><h3>{entry.role}</h3><p>{entry.organisation}</p></div>
										<time>{entry.period}</time>
									</div>
									{entry.highlights.length ? (
										<ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
									) : (
										<p className="quiet-note">Public role details are not listed.</p>
									)}
								</li>
							))}
						</ol>
						<p className="machine-link">
							Read the complete chronology in the <Link href="/resume.json">machine-readable résumé</Link>.
						</p>
					</div>
				</section>

				<section className="methods-band" aria-labelledby="methods-title">
					<div className="page-shell notebook-section compact-section">
						<aside><SectionMark>Working methods</SectionMark></aside>
						<div className="reading-column">
							<h2 id="methods-title">How do I work?</h2>
							<div className="methods-grid">
								{portfolio.skillGroups.map((group) => (
									<article key={group.label}>
										<h3>{group.label}</h3>
										<p>{group.items.join(", ")}</p>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="page-shell notebook-section" id="education" aria-labelledby="education-title">
					<aside>
						<SectionMark>Academic record</SectionMark>
						<p className="margin-note">Computer science foundation<br />Applied data research</p>
					</aside>
					<div className="reading-column">
						<h2 id="education-title">What have I studied?</h2>
						<div className="education-records">
							{higherEducation.map((item) => (
								<article key={item.id}>
									<time>{item.period}</time>
									<h3>{item.qualification}</h3>
									<p className="institution">{item.institution}</p>
									<ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="closing-note" aria-labelledby="contact-title">
					<div className="page-shell closing-inner">
						<div>
							<SectionMark>Next conversation</SectionMark>
							<h2 id="contact-title">Bring me a useful problem.</h2>
							<p>For roles, engineering collaboration or project enquiries, email me directly.</p>
						</div>
						<a className="email-link" href={`mailto:${portfolio.profile.email}`}>{portfolio.profile.email}</a>
					</div>
				</section>
			</main>

			<footer className="notebook-footer">
				<div className="page-shell footer-inner">
					<p>© {new Date().getUTCFullYear()} {portfolio.profile.name}</p>
					<nav aria-label="Machine-readable resources">
						<Link href="/llms.txt">llms.txt</Link>
						<Link href="/resume.json">Résumé JSON</Link>
						<Link href="/projects.json">Projects JSON</Link>
					</nav>
				</div>
			</footer>
		</>
	);
}

import Image from "next/image";
import Link from "next/link";

import CareerMap from "@/components/CareerMap";
import { portfolio, selectedProjects } from "@/content/portfolio";

const higherEducation = portfolio.education.slice(0, 3);

const projectRoutes: Readonly<Record<string, readonly string[]>> = {
	"music-rec-path-signatures": ["Build", "Data"],
	advice: ["Build", "Data"],
	"clock-in-out": ["Data"],
	recomments: ["Build"],
};

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
	const currentPosition = portfolio.experience[0];

	return (
		<>
			<a className="skip-link" href="#main-content">
				Skip to main content
			</a>
			<div className="site-frame">
				<aside className="identity-rail">
					<div>
						<Link className="rail-home" href="/" aria-label="Tino Muzambi, home">
							TM
						</Link>
						<figure className="rail-portrait">
							<Image
								priority
								src="/tino-muzambi.jpg"
								alt="Portrait of Tino Muzambi"
								width={1376}
								height={1376}
								sizes="(max-width: 1024px) 112px, 152px"
							/>
						</figure>
						<p className="identity-role">{portfolio.profile.role}</p>
						<h1>{portfolio.profile.name}</h1>
						<p className="identity-summary">{portfolio.profile.headline}</p>

						<dl className="identity-facts">
							<div>
								<dt>Based in</dt>
								<dd>{portfolio.profile.location}</dd>
							</div>
							<div>
								<dt>Current role</dt>
								<dd>
									{currentPosition.role}, {currentPosition.organisation}
								</dd>
							</div>
						</dl>
					</div>

					<nav className="rail-nav" aria-label="On this page">
						<ul>
							<li><a href="#map">Career map</a></li>
							<li><a href="#work">Selected work</a></li>
							<li><a href="#capabilities">Capabilities</a></li>
							<li><a href="#education">Education</a></li>
						</ul>
					</nav>

					<div className="rail-contact">
						<a className="rail-email" href={`mailto:${portfolio.profile.email}`}>
							{portfolio.profile.email}
						</a>
						<div className="rail-links">
							{portfolio.profile.links.map((link) => (
								<TextLink href={link.href} key={link.label}>{link.label}</TextLink>
							))}
							<Link className="text-link" href="/contact">Contact page</Link>
						</div>
					</div>
				</aside>

				<div className="flow-column">
					<main id="main-content">
						<section className="map-section" id="map" aria-labelledby="map-title">
							<header className="map-intro">
								<p className="career-range">2019 to present</p>
								<h2 id="map-title">Three routes through the work.</h2>
								<p>
									Build, Data and Lead trace the work Tino has published: roles,
									study, projects and specific outcomes. Select a route to follow it;
									the complete evidence always stays on the page.
								</p>
							</header>
							<CareerMap />
						</section>

						<section className="content-section" id="work" aria-labelledby="work-title">
							<header className="content-heading">
								<h2 id="work-title">Selected evidence</h2>
								<p>Four public projects that show different parts of the route.</p>
							</header>

							<div className="project-ledger">
								{selectedProjects.map((project) => {
									const routes = projectRoutes[project.id] ?? ["Build"];

									return (
										<article key={project.id}>
											<p className="project-routes">{routes.join(" + ")}</p>
											<div>
												<h3>{project.name}</h3>
												<p className="project-summary">{project.summary}</p>
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
											</div>
										</article>
									);
								})}
							</div>

							<p className="machine-note">
								Browse all {portfolio.projects.length} projects in <TextLink href="/projects.json">structured JSON</TextLink>.
							</p>
						</section>

						<section className="content-section" id="capabilities" aria-labelledby="capabilities-title">
							<header className="content-heading">
								<h2 id="capabilities-title">Capabilities</h2>
								<p>Technologies evidenced across professional, academic and personal work.</p>
							</header>
							<dl className="capability-ledger">
								{portfolio.skillGroups.map((group) => (
									<div key={group.label}>
										<dt>{group.label}</dt>
										<dd>{group.items.join(", ")}</dd>
									</div>
								))}
							</dl>
						</section>

						<section className="content-section" id="education" aria-labelledby="education-title">
							<header className="content-heading">
								<h2 id="education-title">Formal study</h2>
								<p>Computer science foundations followed by postgraduate data-science research.</p>
							</header>
							<div className="education-ledger">
								{higherEducation.map((item) => (
									<article key={item.id}>
										<p className="education-period">{item.period}</p>
										<div>
											<h3>{item.qualification}</h3>
											<p className="education-institution">{item.institution}</p>
											<ul>
												{item.details.map((detail) => <li key={detail}>{detail}</li>)}
											</ul>
										</div>
									</article>
								))}
							</div>
						</section>

						<section className="contact-panel" aria-labelledby="contact-title">
							<div>
								<h2 id="contact-title">Talk about the work.</h2>
								<p>For roles, engineering collaboration or project enquiries, email Tino directly.</p>
							</div>
							<a href={`mailto:${portfolio.profile.email}`}>{portfolio.profile.email}</a>
						</section>
					</main>

					<footer className="site-footer">
						<p>© {new Date().getUTCFullYear()} {portfolio.profile.name}</p>
						<nav aria-label="Machine-readable resources">
							<ul>
								<li><Link href="/llms.txt">llms.txt</Link></li>
								<li><Link href="/resume.json">Résumé JSON</Link></li>
								<li><Link href="/projects.json">Projects JSON</Link></li>
							</ul>
						</nav>
					</footer>
				</div>
			</div>
		</>
	);
}

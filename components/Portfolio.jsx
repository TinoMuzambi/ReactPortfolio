import React from "react";
import Image from "next/image";
import { FaReact, FaPython, FaHtml5, FaCss3Alt, FaAws } from "react-icons/fa";
import { SiJavascript, SiTypescript } from "react-icons/si";
import { motion } from "framer-motion";

import { left, right } from "../data/variants";

export const getProjectKey = (project, position = 0) => {
	const identity = [
		project.id,
		project.shortname,
		project.name,
		project.title,
		project.github,
		project.link,
	]
		.filter((value) => value !== undefined && value !== null && value !== "")
		.join("|");

	return identity || `project-${position}`;
};

const Portfolio = ({ projects, isActive = true }) => {
	const featuredProjects = projects.filter((project) => project.featured);
	const animationState = isActive ? "end" : "start";

	return (
		<div className="portfolio">
			<h2 id="portfolio-heading" className="title">
				Portfolio
			</h2>

			<div className="cards">
				{featuredProjects.map((project, position) => {
					const keywords = project.keywords || [];
					return (
						<motion.div
							className="mini-card"
							key={getProjectKey(project, position)}
							initial="start"
							animate={animationState}
							variants={position % 2 === 0 ? left : right}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
								type: "spring",
								damping: 10,
								stiffness: 50,
							}}
						>
							<div className="lead">
								<h3 className="title">
									{project.link ? (
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={project.link}
										>
											{project.title}
										</a>
									) : (
										project.title
									)}
								</h3>
								{project.image && (
									<div className="screenshot-holder">
										<Image
											src={project.image}
											alt={`Screenshot of ${project.title}`}
											className="screenshot"
											height={256}
											width={570}
											style={{ objectFit: "contain" }}
										/>
									</div>
								)}
								<p className="text">{project.content?.[0]}</p>
							</div>
							{project.github && (
								<p className="text-g">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={project.github}
									>
										GitHub
									</a>
								</p>
							)}

							<div className="icons">
								{keywords.includes("react") && (
									<span className="icon" data-lang="React" aria-label="React">
										<FaReact className="icon" aria-hidden="true" />
									</span>
								)}
								{keywords.includes("aws") && (
									<span className="icon" data-lang="AWS" aria-label="AWS">
										<FaAws className="icon" aria-hidden="true" />
									</span>
								)}
								{keywords.includes("html") && (
									<span className="icon" data-lang="HTML5" aria-label="HTML5">
										<FaHtml5 aria-hidden="true" />
									</span>
								)}
								{(keywords.includes("css") || keywords.includes("sass")) && (
									<span className="icon" data-lang="CSS3" aria-label="CSS3">
										<FaCss3Alt aria-hidden="true" />
									</span>
								)}
								{keywords.includes("python") && (
									<span className="icon" data-lang="Python" aria-label="Python">
										<FaPython aria-hidden="true" />
									</span>
								)}
								{keywords.includes("typescript") && (
									<span
										className="icon"
										data-lang="TypeScript"
										aria-label="TypeScript"
									>
										<SiTypescript aria-hidden="true" />
									</span>
								)}
								{!keywords.includes("react") &&
									keywords.includes("javascript") && (
										<span
											className="icon"
											data-lang="JavaScript"
											aria-label="JavaScript"
										>
											<SiJavascript aria-hidden="true" />
										</span>
									)}
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
};

export default Portfolio;

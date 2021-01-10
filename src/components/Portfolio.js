import React from "react";
import projects from "../data/projects";
import { FaReact, FaPython, FaHtml5, FaCss3Alt } from "react-icons/fa";

const Portfolio = () => {
	return (
		<div className="portfolio">
			<h1 className="title">Portfolio</h1>

			<div className="cards">
				{projects.splice(0, 5).map((project, key) => (
					<div className="mini-card">
						<h2 className="title">
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
						</h2>
						<p className="text">{project.content[0]}</p>

						{project.github && (
							<p className="text">
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
							{project.keywords.includes("react") && (
								<FaReact className="icon" title="react" />
							)}
							{project.keywords.includes("html") && (
								<FaHtml5 className="icon" title="html5" />
							)}
							{(project.keywords.includes("css") ||
								project.keywords.includes("sass")) && (
								<FaCss3Alt className="icon" title="css3" />
							)}
							{project.keywords.includes("python") && (
								<FaPython className="icon" title="python" />
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Portfolio;

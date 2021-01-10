import React from "react";
import projects from "../data/projects";

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
					</div>
				))}
			</div>
		</div>
	);
};

export default Portfolio;

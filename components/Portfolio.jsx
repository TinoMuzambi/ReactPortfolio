import React from "react";
import Image from "next/image";
import { FaReact, FaPython, FaHtml5, FaCss3Alt, FaAws } from "react-icons/fa";
import { SiJavascript, SiTypescript } from "react-icons/si";
import { motion } from "framer-motion";

import { opacity, left, right } from "../data/variants";
import { shuffle } from "../utils";

const Portfolio = ({ projects }) => {
	return (
		<div className="portfolio">
			<motion.h1
				className="title"
				initial="start"
				animate="end"
				variants={opacity}
			>
				Portfolio
			</motion.h1>

			<div className="cards">
				{shuffle(projects)
					.filter((project) => project.featured)
					.map((project, key) => (
						<motion.div
							className="mini-card"
							key={key}
							initial="start"
							animate="end"
							variants={key % 2 === 0 ? left : right}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
								type: "spring",
								damping: 10,
								stiffness: 50,
							}}
						>
							<div className="lead">
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
								<div className="screenshot-holder">
									<Image
										src={project.image}
										alt={project.title}
										className="screenshot"
										height={256}
										width={570}
										objectFit="contain"
									/>
								</div>
								<p className="text">{project.content[0]}</p>
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
								{project.keywords.includes("react") && (
									<span className="icon" data-lang="React">
										<FaReact className="icon" />
									</span>
								)}
								{project.keywords.includes("aws") && (
									<span className="icon" data-lang="AWS">
										<FaAws className="icon" />
									</span>
								)}
								{project.keywords.includes("html") && (
									<span className="icon" data-lang="HTML5">
										<FaHtml5 />
									</span>
								)}
								{(project.keywords.includes("css") ||
									project.keywords.includes("sass")) && (
									<span className="icon" data-lang="CSS3">
										<FaCss3Alt />
									</span>
								)}
								{project.keywords.includes("python") && (
									<span className="icon" data-lang="Python">
										<FaPython />
									</span>
								)}
								{project.keywords.includes("typescript") && (
									<span className="icon" data-lang="TypeScript">
										<SiTypescript />
									</span>
								)}
								{!project.keywords.includes("react") &&
									project.keywords.includes("javascript") && (
										<span className="icon" data-lang="JavaScript">
											<SiJavascript />
										</span>
									)}
							</div>
						</motion.div>
					))}
			</div>
		</div>
	);
};

export default Portfolio;

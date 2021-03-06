import React from "react";
import { FaReact, FaPython, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { motion } from "framer-motion";

import { opacity, left, right } from "../data/variants";

const Portfolio = ({ projects }) => {
	function shuffle(array) {
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

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
				{shuffle(projects.slice(0, 6)).map((project, key) => (
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
								<img
									src={project.image}
									alt={project.title}
									className="screenshot"
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

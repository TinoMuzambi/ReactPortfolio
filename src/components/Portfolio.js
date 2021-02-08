import React from "react";
import projects from "../data/projects";
import { FaReact, FaPython, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { motion } from "framer-motion";

const Portfolio = () => {
	const left = {
		start: { x: -1000 },
		end: { x: 0 },
	};

	const right = {
		start: { x: 1000 },
		end: { x: 0 },
	};

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
			<h1 className="title">Portfolio</h1>

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
							damping: 6,
							stiffness: 80,
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
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default Portfolio;

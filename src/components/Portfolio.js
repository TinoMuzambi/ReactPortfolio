import React from "react";
import projects from "../data/projects";
import { FaReact, FaPython, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { useSpring, animated } from "react-spring";

const Portfolio = () => {
	const props = useSpring({ opacity: 1, from: { opacity: 0 } });

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
		<animated.div className="portfolio" style={props}>
			<h1 className="title">Portfolio</h1>

			<div className="cards">
				{shuffle(projects.slice(0, 6)).map((project, key) => (
					<div className="mini-card" key={key}>
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
					</div>
				))}
			</div>
		</animated.div>
	);
};

export default Portfolio;

import React from "react";
import tools from "../data/tools";
import { motion } from "framer-motion";

const Tools = () => {
	const left = {
		start: { y: -1000 },
		end: { y: 0 },
	};

	const right = {
		start: { y: 1000 },
		end: { y: 0 },
	};

	const opacity = {
		start: { opacity: 0 },
		end: { opacity: 1 },
	};

	return (
		<div className="tools">
			<motion.h1
				className="title"
				initial="start"
				animate="end"
				variants={opacity}
			>
				Tools and Technologies
			</motion.h1>
			<div className="content">
				{tools.map((tool) =>
					tool.link ? (
						<motion.a
							href={tool.link}
							target="__blank"
							rel="noreferrer"
							className="tools-img"
							key={tool.id}
							initial="start"
							animate="end"
							variants={tool.id % 2 === 0 ? left : right}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<img
								src={tool.icon}
								alt={tool.title}
								title={tool.title}
								className="tools-img"
							/>
						</motion.a>
					) : (
						<motion.img
							src={tool.icon}
							alt={tool.title}
							title={tool.title}
							className="tools-img"
							key={tool.id}
							initial="start"
							animate="end"
							variants={tool.id % 2 === 0 ? left : right}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						></motion.img>
					)
				)}
			</div>
		</div>
	);
};

export default Tools;

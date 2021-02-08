import React from "react";
import tools from "../data/tools";
import { up, down, opacity } from "../data/variants";
import { motion } from "framer-motion";

const Tools = () => {
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
							variants={tool.id % 2 === 0 ? up : down}
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
							variants={tool.id % 2 === 0 ? up : down}
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

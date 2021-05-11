import React from "react";
import { motion } from "framer-motion";

import { up, down, opacity } from "../data/variants";

const Tools = ({ tools }) => {
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
			<div className="main-content">
				{tools.map((tool) =>
					tool.link ? (
						<motion.a
							href={tool.link}
							target="__blank"
							rel="noreferrer"
							className="tools-img"
							key={tool.id}
							data-tool={tool.title}
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
								data-tool={tool.title}
								className="tools-img"
							/>
						</motion.a>
					) : (
						<motion.span
							className="tools-img"
							data-tool={tool.title}
							key={tool.id}
							initial="start"
							animate="end"
							variants={tool.id % 2 === 0 ? up : down}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<img src={tool.icon} alt={tool.title}></img>
						</motion.span>
					)
				)}
			</div>
		</div>
	);
};

export default Tools;

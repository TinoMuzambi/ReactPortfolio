import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { up, down } from "../data/variants";

const Tools = ({ tools, isActive = true }) => {
	const animationState = isActive ? "end" : "start";

	return (
		<div className="tools">
			<h2 id="tools-heading" className="title">
				Tools and Technologies
			</h2>
			<div className="main-content">
				{tools.map((tool, position) =>
					tool.link ? (
						<motion.a
							href={tool.link}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Learn more about ${tool.title}`}
							className="tools-img"
							key={tool.id}
							data-tool={tool.title}
							initial="start"
							animate={animationState}
							variants={position % 2 === 0 ? up : down}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<Image
								src={tool.icon}
								alt={tool.title}
								data-tool={tool.title}
								className="tools-img"
								width={480}
								height={480}
								style={{ height: "auto", width: "100%" }}
							/>
						</motion.a>
					) : (
						<motion.span
							className="tools-img"
							data-tool={tool.title}
							key={tool.id}
							initial="start"
							animate={animationState}
							variants={position % 2 === 0 ? up : down}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<Image
								src={tool.icon}
								alt={tool.title}
								width={480}
								height={480}
								style={{ height: "auto", width: "100%" }}
							/>
						</motion.span>
					)
				)}
			</div>
		</div>
	);
};

export default Tools;

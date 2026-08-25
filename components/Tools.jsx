import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { up, down, opacity } from "../data/variants";

const Tools = ({ tools }) => {
	return (
		<div className="tools">
			<motion.h2
				id="tools-heading"
				className="title"
				initial="start"
				animate="end"
				variants={opacity}
			>
				Tools and Technologies
			</motion.h2>
			<div className="main-content">
				{tools.map((tool) =>
					tool.link ? (
						<motion.a
							href={tool.link}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Learn more about ${tool.title}`}
							className="tools-img"
							key={tool.id || tool.title}
							data-tool={tool.title}
							initial="start"
							animate="end"
							variants={tool.id % 2 === 0 ? up : down}
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
							key={tool.id || tool.title}
							initial="start"
							animate="end"
							variants={tool.id % 2 === 0 ? up : down}
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

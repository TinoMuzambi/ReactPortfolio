import React from "react";
import tools from "../data/tools";
import { useSpring, animated } from "react-spring";

const Tools = () => {
	const props = useSpring({ opacity: 1, from: { opacity: 0 } });

	return (
		<animated.div className="tools" style={props}>
			<h1 className="title">Tools and Technologies</h1>
			<div className="content">
				{tools.map((tool) => (
					<img
						src={tool.icon}
						alt={tool.title}
						title={tool.title}
						className="tools-img"
						key={tool.id}
					/>
				))}
			</div>
		</animated.div>
	);
};

export default Tools;

import React from "react";
import tools from "../data/tools";

const Tools = () => {
	return (
		<div className="tools">
			<h1 className="title">Tools and Technologies</h1>
			<div className="content">{tools.map((tool) => tool.icon)}</div>
		</div>
	);
};

export default Tools;

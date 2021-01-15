import React from "react";
import tools from "../data/tools";

const Tools = () => {
	return <div className="tools">{tools.map((tool, key) => tool.icon)}</div>;
};

export default Tools;

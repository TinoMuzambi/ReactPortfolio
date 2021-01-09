import React from "react";
import About from "./About";

const Holder = () => {
	return (
		<div className="holder">
			<div className="card">
				<div className="sidebar">
					<ul>
						<li>About</li>
						<li>Education</li>
						<li>Experience</li>
						<li>Portfolio</li>
					</ul>
				</div>
				<div className="content">
					<About />
				</div>
			</div>
		</div>
	);
};

export default Holder;

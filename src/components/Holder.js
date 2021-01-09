import React from "react";
import About from "./About";

const Holder = () => {
	return (
		<div className="holder">
			<div className="card">
				<div className="sidebar">
					<div className="profile">
						<img src="/assets/me.jpg" alt="me" className="profile-img" />
						<h2 className="title">Tino Muzambi</h2>
						<h3 className="subtitle">Full-Stack Web Developer</h3>
					</div>
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

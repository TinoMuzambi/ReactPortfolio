import React from "react";
import About from "./About";
import {
	FaInfoCircle,
	FaSchool,
	FaBuilding,
	FaCode,
	FaLaughBeam,
} from "react-icons/fa";
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
					<ul className="items">
						<li className="item active">
							<span>
								<FaInfoCircle className="icon" />
							</span>
							About
						</li>
						<li className="item">
							<span>
								<FaSchool className="icon" />
							</span>
							Education
						</li>
						<li className="item">
							<span>
								<FaBuilding className="icon" />
							</span>
							Experience
						</li>
						<li className="item">
							<span>
								<FaCode className="icon" />
							</span>
							Portfolio
						</li>
					</ul>
					<div className="joke">
						<p className="text">
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id quo
							ipsa saepe esse doloremque dolorem incidunt ratione ducimus sint
							error.
						</p>
						<FaLaughBeam className="icon" />
					</div>
				</div>
				<div className="content">
					<About />
				</div>
			</div>
		</div>
	);
};

export default Holder;

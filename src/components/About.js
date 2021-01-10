import React from "react";

const About = () => {
	return (
		<div className="about">
			<h1 className="title">About</h1>
			<div className="mini-card">
				<img src="/assets/about.png" alt="person" className="tag" />
				{/* Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */}
				<p className="text">
					I'm Tino. An avid techie and software developer based in Cape Town,
					South Africa. I'm keen on creating software that solves the problems
					that everyday people have. I have a strong foundation in Computer
					Science and am always looking to learn new things.
				</p>
			</div>
			<div className="mini-card">
				<img src="/assets/hobbies.png" alt="person" className="tag" />

				<p className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odit
					aspernatur consequuntur voluptates ipsa earum, et, laboriosam aliquam,
					architecto dignissimos impedit doloremque quaerat reiciendis fugit
					assumenda! Tempore animi incidunt perferendis!
				</p>
			</div>
			<div className="mini-card">
				<img src="/assets/socials.png" alt="person" className="tag" />

				<p className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odit
					aspernatur consequuntur voluptates ipsa earum, et, laboriosam aliquam,
					architecto dignissimos impedit doloremque quaerat reiciendis fugit
					assumenda! Tempore animi incidunt perferendis!
				</p>
			</div>
		</div>
	);
};

export default About;

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

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
					In my free time I enjoy playing the piano, solving the Rubik's cube as
					well as discovering new places. I'm also a hobby video editor, and a
					hobby blogger. You can read more about both of those and about me in
					general on my blog{" "}
					<a
						href="https://blog.tinomuzambi.com"
						target="_blank"
						rel="noreferrer"
						className="blog-link"
					>
						blog.tinomuzambi.com
					</a>
					.
				</p>
			</div>
			<div className="mini-card">
				<img src="/assets/socials.png" alt="person" className="tag" />

				<div className="socials">
					<a
						href="https://facebook.com"
						className="link"
						target="_blank"
						rel="noreferrer"
					>
						<FaFacebook className="icon" />
					</a>
					<a
						href="https://linkedin.com"
						className="link"
						target="_blank"
						rel="noreferrer"
					>
						<FaLinkedin className="icon" />
					</a>
					<a
						href="https://twitter.com"
						className="link"
						target="_blank"
						rel="noreferrer"
					>
						<FaTwitter className="icon" />
					</a>
					<a
						href="https://instagram.com"
						className="link"
						target="_blank"
						rel="noreferrer"
					>
						<FaInstagram className="icon" />
					</a>
				</div>
			</div>
		</div>
	);
};

export default About;

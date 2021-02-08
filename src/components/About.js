import React from "react";
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
	FaYoutube,
	FaGithub,
	FaMailBulk,
} from "react-icons/fa";

import { motion } from "framer-motion";

const About = () => {
	const variants = {
		start: { x: -1000 },
		end: { x: 0 },
	};

	return (
		<div className="about">
			<h1 className="title">About</h1>
			<motion.div
				className="mini-card"
				initial="start"
				animate="end"
				variants={variants}
				transition={{ ease: "easeOut", duration: 0.2 }}
			>
				<h2 className="subtitle">Bio</h2>
				<div className="inner">
					<img src="/assets/about.png" alt="person" className="tag" />
					{/* Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */}
					<p className="text">
						I'm Tino. An avid techie and software developer based in Cape Town,
						South Africa. I'm keen on creating software that solves the problems
						that everyday people have. I have a strong foundation in Computer
						Science and am always looking to learn new things.
					</p>
				</div>
			</motion.div>
			<div className="mini-card">
				<h2 className="subtitle">Hobbies</h2>
				<div className="inner">
					<img src="/assets/hobbies.png" alt="person" className="tag" />

					<p className="text">
						In my free time I enjoy playing the piano, solving the Rubik's cube,
						playing Table Tennis as well as discovering new places. I'm also a
						hobby video editor, and a hobby blogger. You can read more about
						both of those and about me in general on my blog{" "}
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
			</div>
			<div className="mini-card">
				<h2 className="subtitle">Socials</h2>
				<div className="inner">
					<img src="/assets/socials.png" alt="person" className="tag" />

					<div className="socials">
						<a
							href="https://bit.ly/TinoFacebook"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaFacebook className="icon" />
						</a>
						<a
							href="https://bit.ly/TinoLinkedIn"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaLinkedin className="icon" />
						</a>
						<a
							href="https://bit.ly/TinoTwitter"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaTwitter className="icon" />
						</a>
						<a
							href="https://bit.ly/TinoInstagram"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaInstagram className="icon" />
						</a>
						<a
							href="https://bit.ly/TinoYouTube"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaYoutube className="icon" />
						</a>
						<a
							href="https://bit.ly/TinoGitHub"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							<FaGithub className="icon" />
						</a>
						<a href="mailto:tino@tinomuzambi.com" className="link">
							<FaMailBulk className="icon" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;

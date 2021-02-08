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
import about from "../data/about";
import { motion } from "framer-motion";
import parse from "html-react-parser";

const About = () => {
	const variants = {
		start: { x: -1000 },
		end: { x: 0 },
	};

	return (
		<div className="about">
			<h1 className="title">About</h1>
			{about.map((item, key) => (
				<motion.div
					className="mini-card"
					key={key}
					initial="start"
					animate="end"
					variants={variants}
					transition={{ ease: "easeOut", duration: 0.2 }}
				>
					<h2 className="subtitle">{item.title}</h2>
					<div className="inner">
						<img src={item.image} alt="person" className="tag" />
						{/* Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */}
						{item.text ? (
							<p className="text">{parse(item.text)}</p>
						) : (
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
						)}
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default About;

import React from "react";
import Image from "next/image";
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
import parse from "html-react-parser";

import { opacity, left, right } from "../data/variants";
import Contact from "./Contact";

const About = ({ about, isActive = true }) => {
	const animationState = isActive ? "end" : "start";

	return (
		<div className="about">
			<motion.h2
				id="about-heading"
				className="title"
				initial="start"
				animate={animationState}
				variants={opacity}
			>
				About
			</motion.h2>
			{about.map((item, position) => (
				<motion.div
					className="mini-card"
					key={`${item.title}|${item.image}`}
					initial="start"
					animate={animationState}
					variants={position % 2 === 0 ? left : right}
					transition={{
						ease: "easeInOut",
						duration: 0.2,
						type: "spring",
						damping: 10,
						stiffness: 50,
					}}
				>
					<h3 className="subtitle">{item.title}</h3>
					<div className="inner">
						<Image
							src={item.image}
							alt={`Illustration for ${item.title}`}
							className="tag"
							width={160}
							height={112}
						/>
						{/* Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */}
						{item.text ? (
							<p className="text">{parse(item.text)}</p>
						) : (
							<div className="socials">
								<a
									href="https://bit.ly/TinoFacebook"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on Facebook"
								>
									<FaFacebook className="icon" />
								</a>
								<a
									href="https://bit.ly/TinoLinkedIn"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on LinkedIn"
								>
									<FaLinkedin className="icon" />
								</a>
								<a
									href="https://bit.ly/TinoTwitter"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on Twitter"
								>
									<FaTwitter className="icon" />
								</a>
								<a
									href="https://bit.ly/TinoInstagram"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on Instagram"
								>
									<FaInstagram className="icon" />
								</a>
								<a
									href="https://bit.ly/TinoYouTube"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on YouTube"
								>
									<FaYoutube className="icon" />
								</a>
								<a
									href="https://bit.ly/TinoGitHub"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Tino Muzambi on GitHub"
								>
									<FaGithub className="icon" />
								</a>
								<a
									href="mailto:tino@tinomuzambi.com"
									className="link"
									aria-label="Email Tino Muzambi"
								>
									<FaMailBulk className="icon" />
								</a>
							</div>
						)}
					</div>
				</motion.div>
			))}

			<Contact isActive={isActive} />
		</div>
	);
};

export default About;

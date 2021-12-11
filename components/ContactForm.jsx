import { motion } from "framer-motion";

import { opacity, left, right } from "../data/variants";

const ContactForm = () => {
	return (
		<motion.div
			className="mini-card"
			initial="start"
			animate="end"
			variants={right}
			transition={{
				ease: "easeInOut",
				duration: 0.2,
				type: "spring",
				damping: 10,
				stiffness: 50,
			}}
		>
			<h2 className="subtitle">Contact Me</h2>
			<div className="inner">
				<img
					src="https://a.storyblok.com/f/105639/512x512/0fdffa11eb/hobbies.png"
					alt="contact"
					className="tag"
				/>
				<form className="form">
					<div className="input-group">
						<label htmlFor="name">Name:</label>
						<input type="text" name="name" id="name" />
					</div>
					<div className="input-group">
						<label htmlFor="email">Email:</label>
						<input type="email" name="email" id="email" />
					</div>
					<div className="input-group">
						<label htmlFor="subject">Subject:</label>
						<input type="text" name="subject" id="subject" />
					</div>
					<div className="input-group">
						<label htmlFor="message">Message:</label>
						<textarea name="message" id="message" />
					</div>
				</form>
			</div>
		</motion.div>
	);
};

export default ContactForm;

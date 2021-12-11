import { motion } from "framer-motion";

import { right } from "../data/variants";

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
				<ContactForm />
			</div>
		</motion.div>
	);
};

export default ContactForm;

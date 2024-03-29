import Image from "next/image";
import { motion } from "framer-motion";

import { right } from "../data/variants";
import ContactForm from "./ContactForm";

const Contact = () => {
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
				<Image
					src="https://a.storyblok.com/f/105639/512x512/0fdffa11eb/hobbies.png"
					alt="contact"
					className="tag"
					width={160}
					height={112}
				/>
				<ContactForm />
			</div>
		</motion.div>
	);
};

export default Contact;

import { useState } from "react";

const ContactForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	return (
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
	);
};

export default ContactForm;

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
				<input
					type="text"
					name="name"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="input-group">
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="input-group">
				<label htmlFor="subject">Subject:</label>
				<input
					type="text"
					name="subject"
					id="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
				/>
			</div>
			<div className="input-group">
				<label htmlFor="message">Message:</label>
				<textarea
					name="message"
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>
			<div class="input-group">
				<input type="submit" value="Send" />
			</div>
		</form>
	);
};

export default ContactForm;

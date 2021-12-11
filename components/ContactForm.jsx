const ContactForm = () => {
	return (
		<div>
			<h2 className="subtitle">Contact Me</h2>
			<div className="inner">
				<img
					src="https://a.storyblok.com/f/105639/512x512/0fdffa11eb/hobbies.png"
					alt="contact"
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
		</div>
	);
};

export default ContactForm;

import nodemailer from "nodemailer";

import { getHtml } from "../../../utils";

export default async (req, res) => {
	const { email, name, message, subject } = req.body;

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tinomuzambi@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	const options = {
		from: "tinomuzambi@gmail.com",
		to: "tino@tinomuzambi.com",
		replyTo: email,
		subject: `${subject} | Form Submission from TinoMuzambi`,
		text: `${name} sent you a message from tinomuzambi.com. They said: "${message}".`,
		html: getHtml(
			"New Message",
			`
				<h1>New message on <a href="https://tinomuzambi.com" target="_blank">ReComments</a></h1>
				<p><b>${name}</b> sent you a message.</p>
				<p>They said:</p>
				<blockquote>${message}</blockquote>
			`
		),
	};

	try {
		const send = async () => {
			await transporter.sendMail(options);
		};
		await send();
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error: error });
	}
};

import nodemailer from "nodemailer";

import { getHtml } from "../../../utils";

export default async (req, res) => {
	const { to, fromName, messageText, subject } = req.body;

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tinomuzambi@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	const options = {
		from: "tinomuzambi@gmail.com",
		to: to,
		subject: "TinoMuzambi | New form submission",
		text: `${fromName} sent you a message from tinomuzambi.com. They said: "${messageText}".`,
		html: getHtml(
			"New Message",
			`
				<h1>New message on <a href="https://tinomuzambi.com" target="_blank">ReComments</a></h1>
				<p><b>${fromName}</b> sent you a message.</p>
				<p>They said:</p>
				<blockquote>${messageText}</blockquote>
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

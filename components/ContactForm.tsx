import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

export const CONTACT_REQUEST_TIMEOUT_MS = 10_000;

const HONEYPOT_STYLE: CSSProperties = {
	position: "absolute",
	left: "-10000px",
	width: "1px",
	height: "1px",
	overflow: "hidden",
};

type FormStatus = {
	type: "idle" | "pending" | "success" | "error";
	message: string;
};

class ContactRequestError extends Error {
	constructor(readonly status: number) {
		super("Contact request failed");
	}
}

const ContactForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<FormStatus>({
		type: "idle",
		message: "",
	});
	const submittingRef = useRef(false);
	const requestControllerRef = useRef<AbortController | null>(null);

	useEffect(
		() => () => {
			requestControllerRef.current?.abort();
		},
		[]
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submittingRef.current) return;

		submittingRef.current = true;
		setIsSubmitting(true);
		setStatus({ type: "pending", message: "Sending your message…" });
		const controller = new AbortController();
		requestControllerRef.current = controller;
		const timeoutId = setTimeout(
			() => controller.abort(),
			CONTACT_REQUEST_TIMEOUT_MS
		);

		try {
			const response = await fetch("/api/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, subject, message, website }),
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new ContactRequestError(response.status);
			}

			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
			setWebsite("");
			setStatus({ type: "success", message: "Message sent successfully." });
		} catch (error) {
			const serviceUnavailable =
				error instanceof ContactRequestError && error.status === 503;
			setStatus({
				type: "error",
				message: controller.signal.aborted
					? "Sending timed out. Your message was kept; please try again."
					: serviceUnavailable
						? "Email delivery is temporarily unavailable. Your message was kept; please email tino@tinomuzambi.com or try again."
						: "Something went wrong. Your message was kept; please try again.",
			});
		} finally {
			clearTimeout(timeoutId);
			if (requestControllerRef.current === controller) {
				requestControllerRef.current = null;
			}
			submittingRef.current = false;
			setIsSubmitting(false);
		}
	};

	const statusClassName =
		status.type === "success" || status.type === "error"
			? `form-status form-status--${status.type}`
			: "form-status";

	return (
		<form className="form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
			<div className="input-group">
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					id="name"
					value={name}
					onChange={(event) => setName(event.target.value)}
					maxLength={100}
					required
				/>
			</div>
			<div className="input-group">
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					maxLength={254}
					required
				/>
			</div>
			<div className="input-group">
				<label htmlFor="subject">Subject:</label>
				<input
					type="text"
					name="subject"
					id="subject"
					value={subject}
					onChange={(event) => setSubject(event.target.value)}
					maxLength={150}
					required
				/>
			</div>
			<div className="input-group">
				<label htmlFor="message">Message:</label>
				<textarea
					name="message"
					id="message"
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					maxLength={5000}
					required
				/>
			</div>
			<div aria-hidden="true" style={HONEYPOT_STYLE}>
				<label htmlFor="website">Website:</label>
				<input
					type="text"
					name="website"
					id="website"
					value={website}
					onChange={(event) => setWebsite(event.target.value)}
					maxLength={200}
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>
			<div className="input-group">
				<input
					type="submit"
					value={isSubmitting ? "Sending…" : "Send"}
					disabled={isSubmitting}
				/>
			</div>
			<p
				className={statusClassName}
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{status.message}
			</p>
		</form>
	);
};

export default ContactForm;

import nodemailer from "nodemailer";

import { getHtml } from "../../../utils";

export const CONTACT_LIMITS = Object.freeze({
	name: 100,
	email: 254,
	subject: 150,
	message: 5000,
	website: 200,
});

const MAX_REQUEST_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^(?=.{3,254}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADER_LINE_BREAK = /[\r\n]/;

export const escapeHtml = (value) =>
	value.replace(/[&<>"']/g, (character) => {
		const entities = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};

		return entities[character];
	});

const isRecord = (value) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
};

const readString = (body, field, { required = true } = {}) => {
	const value = body[field];

	if (!required && value === undefined) return "";
	if (typeof value !== "string") {
		throw new TypeError(`${field} must be a string`);
	}

	const trimmed = value.trim();
	if (required && trimmed.length === 0) {
		throw new TypeError(`${field} is required`);
	}
	if (trimmed.length > CONTACT_LIMITS[field]) {
		throw new TypeError(`${field} is too long`);
	}

	return trimmed;
};

export const validateContactSubmission = (body) => {
	if (!isRecord(body)) throw new TypeError("body must be an object");

	const submission = {
		name: readString(body, "name"),
		email: readString(body, "email"),
		subject: readString(body, "subject"),
		message: readString(body, "message"),
		website: readString(body, "website", { required: false }),
	};

	if (!EMAIL_PATTERN.test(submission.email)) {
		throw new TypeError("email is invalid");
	}
	if (
		HEADER_LINE_BREAK.test(submission.name) ||
		HEADER_LINE_BREAK.test(submission.subject)
	) {
		throw new TypeError("header fields cannot contain line breaks");
	}

	return submission;
};

export const createRateLimiter = ({
	limit = 5,
	windowMs = 10 * 60 * 1000,
	now = () => Date.now(),
	maxEntries = 10000,
} = {}) => {
	const attempts = new Map();

	return {
		consume(key) {
			const currentTime = now();
			let entry = attempts.get(key);

			if (!entry || currentTime >= entry.resetAt) {
				entry = { count: 0, resetAt: currentTime + windowMs };
			}

			if (entry.count >= limit) {
				return {
					allowed: false,
					retryAfter: Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000)),
				};
			}

			entry.count += 1;
			attempts.set(key, entry);

			// This bounds memory in a warm function instance. It is deliberately only a
			// best-effort serverless guard; durable, global limits belong at the edge.
			if (attempts.size > maxEntries) {
				attempts.delete(attempts.keys().next().value);
			}

			return { allowed: true, retryAfter: 0 };
		},
	};
};

const getHeader = (req, name) => {
	const value = req.headers?.[name];
	return Array.isArray(value) ? value[0] : value;
};

export const getClientKey = (req) => {
	const forwardedFor = getHeader(req, "x-forwarded-for");
	const address =
		(typeof forwardedFor === "string" && forwardedFor.split(",")[0].trim()) ||
		getHeader(req, "x-real-ip") ||
		req.socket?.remoteAddress ||
		"unknown";

	return String(address).slice(0, 100);
};

export const buildMailOptions = ({ email, name, message, subject }) => ({
	from: "tinomuzambi@gmail.com",
	to: "tino@tinomuzambi.com",
	replyTo: email,
	subject: `${subject} | Form Submission from TinoMuzambi`,
	text: `${name} sent you a message from tinomuzambi.com. They said: "${message}".`,
	html: getHtml(
		"New Message",
		`
			<h1>New message on <a href="https://tinomuzambi.com" target="_blank">TinoMuzambi</a></h1>
			<p><b>${escapeHtml(name)}</b> sent you a message.</p>
			<p>They said:</p>
			<blockquote>${escapeHtml(message)}</blockquote>
		`
	),
});

export const createEmailHandler = ({
	createTransport = nodemailer.createTransport,
	rateLimiter = createRateLimiter(),
	env = process.env,
	logger = console,
} = {}) =>
	async function emailHandler(req, res) {
		if (req.method !== "POST") {
			res.setHeader("Allow", "POST");
			return res.status(405).json({ success: false, error: "Method not allowed." });
		}

		const contentType = getHeader(req, "content-type");
		if (
			typeof contentType !== "string" ||
			!contentType.toLowerCase().startsWith("application/json")
		) {
			return res
				.status(415)
				.json({ success: false, error: "Content-Type must be application/json." });
		}

		const contentLength = Number(getHeader(req, "content-length"));
		if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
			return res.status(413).json({ success: false, error: "Request is too large." });
		}

		const rateLimit = rateLimiter.consume(getClientKey(req));
		if (!rateLimit.allowed) {
			res.setHeader("Retry-After", String(rateLimit.retryAfter));
			return res
				.status(429)
				.json({ success: false, error: "Too many requests. Please try again later." });
		}

		let submission;
		try {
			submission = validateContactSubmission(req.body);
		} catch {
			return res
				.status(400)
				.json({ success: false, error: "Invalid form submission." });
		}

		// Treat a filled honeypot as success so automated senders get no useful signal.
		if (submission.website) return res.status(200).json({ success: true });

		if (!env.GMAIL_PASS) {
			logger.error("Contact email is not configured: GMAIL_PASS is missing.");
			return res
				.status(503)
				.json({ success: false, error: "Message service is unavailable." });
		}

		try {
			const transporter = createTransport({
				service: "gmail",
				auth: {
					user: "tinomuzambi@gmail.com",
					pass: env.GMAIL_PASS,
				},
			});
			await transporter.sendMail(buildMailOptions(submission));
			return res.status(200).json({ success: true });
		} catch (error) {
			logger.error(
				"Contact email delivery failed.",
				error instanceof Error ? error.message : "Unknown error"
			);
			return res
				.status(502)
				.json({ success: false, error: "Message could not be delivered." });
		}
	};

export default createEmailHandler();

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
const DEFAULT_GMAIL_USER = "tinomuzambi@gmail.com";
export const DEFAULT_CONTACT_EMAIL = "tino@tinomuzambi.com";
const HTML_ENTITIES = Object.freeze({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
});

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "16kb",
		},
	},
};

export const escapeHtml = (value) =>
	value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);

const isRecord = (value) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
};

const readString = (body, field, { required = true } = {}) => {
	const value = body[field];

	if (!required && value == null) return "";
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
	const entryLimit = Math.max(1, maxEntries);

	const touch = (key, entry) => {
		attempts.delete(key);
		attempts.set(key, entry);

		// Refreshing insertion order makes this a bounded LRU map: a client that
		// continues making attempts cannot reset its quota through key churn.
		if (attempts.size > entryLimit) {
			attempts.delete(attempts.keys().next().value);
		}
	};

	return {
		consume(key) {
			const currentTime = now();
			let entry = attempts.get(key);

			if (!entry || currentTime >= entry.resetAt) {
				entry = { count: 0, resetAt: currentTime + windowMs };
			}

			if (entry.count >= limit) {
				touch(key, entry);
				return {
					allowed: false,
					retryAfter: Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000)),
				};
			}

			entry.count += 1;
			touch(key, entry);

			return { allowed: true, retryAfter: 0 };
		},
	};
};

const getHeader = (req, name) => {
	const value = req.headers?.[name];
	return Array.isArray(value) ? value[0] : value;
};

export const getClientKey = (req, env = process.env) => {
	const vercelForwardedFor = getHeader(req, "x-vercel-forwarded-for");
	const trustedForwardedAddress =
		env.VERCEL === "1" && typeof vercelForwardedFor === "string"
			? vercelForwardedFor.split(",")[0].trim()
			: "";
	const address = trustedForwardedAddress || req.socket?.remoteAddress || "unknown";

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

const readEnvironmentValue = (value) =>
	typeof value === "string" ? value.trim() : "";

export const getFallbackContactEmail = (env = process.env) => {
	const configuredAddress = readEnvironmentValue(env.CONTACT_EMAIL_TO);
	return EMAIL_PATTERN.test(configuredAddress)
		? configuredAddress
		: DEFAULT_CONTACT_EMAIL;
};

export const getMailConfig = (env = process.env) => {
	const appPassword = readEnvironmentValue(env.GMAIL_APP_PASSWORD);
	const legacyPassword = readEnvironmentValue(env.GMAIL_PASS);
	const password = appPassword || legacyPassword;

	if (!password) return null;

	const user = readEnvironmentValue(env.GMAIL_USER) || DEFAULT_GMAIL_USER;
	const to = readEnvironmentValue(env.CONTACT_EMAIL_TO) || DEFAULT_CONTACT_EMAIL;
	if (!EMAIL_PATTERN.test(user) || !EMAIL_PATTERN.test(to)) return null;

	return {
		user,
		password: password.replace(/\s/g, ""),
		to,
	};
};

const getDeliveryFailureStatus = (error) =>
	error?.code === "EAUTH" || error?.responseCode === 535 ? 503 : 502;

const getDeliveryLogContext = (error, sensitiveValues = []) => {
	const errorObject = error && typeof error === "object" ? error : {};
	const rawMessage =
		typeof errorObject.message === "string"
			? errorObject.message
			: typeof error === "string"
				? error
				: "Unknown delivery error";
	const message = sensitiveValues
		.filter(
			(value) => typeof value === "string" && value.trim().length > 0
		)
		.reduce(
			(currentMessage, value) =>
				currentMessage.split(value).join("[REDACTED]"),
			rawMessage
		)
		.replace(/[\r\n\t]+/g, " ")
		.slice(0, 500);

	return {
		code: errorObject.code || "UNKNOWN",
		responseCode: errorObject.responseCode || null,
		message,
	};
};

export const createEmailHandler = ({
	createTransport = nodemailer.createTransport,
	rateLimiter = createRateLimiter(),
	env = process.env,
	logger = console,
} = {}) =>
	async function emailHandler(req, res) {
		res.setHeader("Cache-Control", "no-store");

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

		let submission;
		try {
			submission = validateContactSubmission(req.body);
		} catch {
			return res
				.status(400)
				.json({ success: false, error: "Invalid form submission." });
		}

		if (submission.website) {
			return res
				.status(400)
				.json({ success: false, error: "Invalid form submission." });
		}

		const mailConfig = getMailConfig(env);
		if (!mailConfig) {
			logger.error(
				"Contact email is not configured: credentials or addresses are missing or invalid."
			);
			return res
				.status(503)
				.json({
					success: false,
					error: "Message service is unavailable.",
					contactEmail: getFallbackContactEmail(env),
				});
		}

		const rateLimit = rateLimiter.consume(getClientKey(req, env));
		if (!rateLimit.allowed) {
			res.setHeader("Retry-After", String(rateLimit.retryAfter));
			return res
				.status(429)
				.json({ success: false, error: "Too many requests. Please try again later." });
		}

		try {
			const transporter = createTransport({
				service: "gmail",
				auth: {
					user: mailConfig.user,
					pass: mailConfig.password,
				},
			});
			await transporter.sendMail({
				...buildMailOptions(submission),
				from: mailConfig.user,
				to: mailConfig.to,
			});
			return res.status(200).json({ success: true });
		} catch (error) {
			logger.error(
				"Contact email delivery failed.",
				getDeliveryLogContext(error, [
					mailConfig.password,
					env.GMAIL_APP_PASSWORD,
					env.GMAIL_PASS,
				])
			);
			const status = getDeliveryFailureStatus(error);
			return res
				.status(status)
				.json({
					success: false,
					error: "Message could not be delivered.",
					...(status === 503 ? { contactEmail: mailConfig.to } : {}),
				});
		}
	};

export default createEmailHandler();

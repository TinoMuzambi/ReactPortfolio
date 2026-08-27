import nodemailer from "nodemailer";
import type { NextApiHandler, NextApiRequest } from "next";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { getHtml } from "../../../utils";

export const CONTACT_LIMITS = Object.freeze({
	name: 100,
	email: 254,
	subject: 150,
	message: 5000,
	website: 200,
});

type ContactField = keyof typeof CONTACT_LIMITS;
type Environment = Readonly<Record<string, string | undefined>>;

export interface ContactSubmission {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
}

export interface ContactResponse {
	success: boolean;
	error?: string;
	contactEmail?: string;
}

export interface ContactApiRequest {
	method?: string;
	headers: NextApiRequest["headers"];
	body: unknown;
	socket: { remoteAddress?: string };
}

export interface ContactApiResponse {
	setHeader(name: string, value: number | string | readonly string[]): void;
	status(statusCode: number): ContactApiResponse;
	json(body: ContactResponse): unknown;
}

interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}

interface RateLimiter {
	consume(key: string): RateLimitResult;
}

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

interface TransporterLike {
	sendMail(options: Mail.Options): Promise<unknown>;
}

type TransportFactory = (options: SMTPTransport.Options) => TransporterLike;

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

export const escapeHtml = (value: string): string =>
	value.replace(
		/[&<>"']/g,
		(character) => HTML_ENTITIES[character as keyof typeof HTML_ENTITIES]
	);

const isRecord = (value: unknown): value is Record<string, unknown> => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
};

const readString = (
	body: Record<string, unknown>,
	field: ContactField,
	{ required = true }: { required?: boolean } = {}
): string => {
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

export const validateContactSubmission = (body: unknown): ContactSubmission => {
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
}: {
	limit?: number;
	windowMs?: number;
	now?: () => number;
	maxEntries?: number;
} = {}): RateLimiter => {
	const attempts = new Map<string, RateLimitEntry>();
	const entryLimit = Math.max(1, maxEntries);

	const touch = (key: string, entry: RateLimitEntry) => {
		attempts.delete(key);
		attempts.set(key, entry);

		// Refreshing insertion order makes this a bounded LRU map: a client that
		// continues making attempts cannot reset its quota through key churn.
		if (attempts.size > entryLimit) {
			const oldestKey = attempts.keys().next().value;
			if (oldestKey !== undefined) attempts.delete(oldestKey);
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

const getHeader = (req: ContactApiRequest, name: string): string | undefined => {
	const value = req.headers?.[name];
	return Array.isArray(value) ? value[0] : value;
};

export const getClientKey = (
	req: ContactApiRequest,
	env: Environment = process.env
): string => {
	const vercelForwardedFor = getHeader(req, "x-vercel-forwarded-for");
	const trustedForwardedAddress =
		env.VERCEL === "1" && typeof vercelForwardedFor === "string"
			? vercelForwardedFor.split(",")[0].trim()
			: "";
	const address = trustedForwardedAddress || req.socket?.remoteAddress || "unknown";

	return String(address).slice(0, 100);
};

export const buildMailOptions = ({
	email,
	name,
	message,
	subject,
}: ContactSubmission): Mail.Options => ({
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

interface MailConfig {
	user: string;
	password: string;
	to: string;
}

const readEnvironmentValue = (value: string | undefined): string =>
	typeof value === "string" ? value.trim() : "";

export const getFallbackContactEmail = (
	env: Environment = process.env
): string => {
	const configuredAddress = readEnvironmentValue(env.CONTACT_EMAIL_TO);
	return EMAIL_PATTERN.test(configuredAddress)
		? configuredAddress
		: DEFAULT_CONTACT_EMAIL;
};

export const getMailConfig = (
	env: Environment = process.env
): MailConfig | null => {
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

const getDeliveryErrorMetadata = (error: unknown) => {
	if (typeof error !== "object" || error === null) {
		return { code: "UNKNOWN", responseCode: undefined };
	}

	const { code, responseCode } = error as {
		code?: unknown;
		responseCode?: unknown;
	};

	return { code, responseCode };
};

const getDeliveryFailureStatus = (error: unknown): number => {
	const { code, responseCode } = getDeliveryErrorMetadata(error);
	return code === "EAUTH" || responseCode === 535 ? 503 : 502;
};

interface EmailHandlerDependencies {
	createTransport?: TransportFactory;
	rateLimiter?: RateLimiter;
	env?: Environment;
	logger?: Pick<Console, "error">;
}

const defaultTransportFactory: TransportFactory = (options) =>
	nodemailer.createTransport(options);

const getDeliveryLogContext = (
	error: unknown,
	sensitiveValues: readonly (string | undefined)[] = []
) => {
	const errorObject =
		error && typeof error === "object"
			? (error as { code?: unknown; message?: unknown; responseCode?: unknown })
			: {};
	const rawMessage =
		typeof errorObject.message === "string"
			? errorObject.message
			: typeof error === "string"
				? error
				: "Unknown delivery error";
	const message = sensitiveValues
		.filter((value): value is string =>
			Boolean(typeof value === "string" && value.trim().length > 0)
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
	createTransport = defaultTransportFactory,
	rateLimiter = createRateLimiter(),
	env = process.env,
	logger = console,
}: EmailHandlerDependencies = {}) =>
	async function emailHandler(
		req: ContactApiRequest,
		res: ContactApiResponse
	) {
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

const handler = createEmailHandler();

export default handler satisfies NextApiHandler<ContactResponse>;

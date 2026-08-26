import { describe, expect, it, vi } from "vitest";

import {
	CONTACT_LIMITS,
	buildMailOptions,
	config,
	createEmailHandler,
	createRateLimiter,
	escapeHtml,
	getClientKey,
	getMailConfig,
	validateContactSubmission,
} from "../../pages/api/email";

const validBody = {
	name: "Tino",
	email: "tino@example.com",
	subject: "Hello",
	message: "A useful message",
	website: "",
};

const createRequest = (overrides = {}) => ({
	method: "POST",
	headers: {
		"content-type": "application/json",
		"x-forwarded-for": "203.0.113.10",
	},
	body: validBody,
	socket: {},
	...overrides,
});

const createResponse = () => {
	const response = {
		body: undefined,
		headers: {},
		statusCode: undefined,
		setHeader: vi.fn((name, value) => {
			response.headers[name] = value;
		}),
		status: vi.fn((statusCode) => {
			response.statusCode = statusCode;
			return response;
		}),
		json: vi.fn((body) => {
			response.body = body;
			return response;
		}),
	};
	return response;
};

const createHandler = (overrides = {}) => {
	const sendMail = vi.fn().mockResolvedValue({ messageId: "message-id" });
	const createTransport = vi.fn(() => ({ sendMail }));
	const logger = { error: vi.fn() };
	const handler = createEmailHandler({
		createTransport,
		env: { GMAIL_PASS: "app-password" },
		logger,
		...overrides,
	});
	return { createTransport, handler, logger, sendMail };
};

describe("contact submission validation", () => {
	it("normalizes a valid submission", () => {
		expect(
			validateContactSubmission({
				...validBody,
				name: "  Tino  ",
				website: null,
			})
		).toEqual({ ...validBody, website: "" });
	});

	it("normalizes copied Gmail app passwords and supports mail overrides", () => {
		expect(
			getMailConfig({
				GMAIL_APP_PASSWORD: "abcd efgh\tijkl mnop",
				GMAIL_PASS: "legacy-password",
				GMAIL_USER: "sender@example.com",
				CONTACT_EMAIL_TO: "recipient@example.com",
			})
		).toEqual({
			user: "sender@example.com",
			password: "abcdefghijklmnop",
			to: "recipient@example.com",
		});
		expect(getMailConfig({})).toBeNull();
	});

	it.each([
		[null, "non-object body"],
		[{ ...validBody, name: 42 }, "non-string field"],
		[{ ...validBody, email: "not-an-email" }, "invalid email"],
		[{ ...validBody, subject: "hello\nBcc: victim@example.com" }, "header injection"],
		[
			{ ...validBody, message: "x".repeat(CONTACT_LIMITS.message + 1) },
			"overlong field",
		],
	])("rejects %s (%s)", (body) => {
		expect(() => validateContactSubmission(body)).toThrow(TypeError);
	});

	it("escapes every HTML-sensitive character in email markup", () => {
		expect(escapeHtml(`<script data-x="'">&</script>`)).toBe(
			"&lt;script data-x=&quot;&#39;&quot;&gt;&amp;&lt;/script&gt;"
		);
		const options = buildMailOptions({
			...validBody,
			name: "<img src=x onerror=alert(1)>",
			message: "<script>alert('xss')</script>",
		});
		expect(options.html).not.toContain("<script>alert");
		expect(options.html).not.toContain("<img src=x");
		expect(options.html).toContain("&lt;script&gt;");
	});
});

describe("email API handler", () => {
	it("configures the Next.js body parser with a 16 KiB limit", () => {
		expect(config).toEqual({
			api: {
				bodyParser: {
					sizeLimit: "16kb",
				},
			},
		});
	});

	it("accepts POST only", async () => {
		const { createTransport, handler } = createHandler();
		const response = createResponse();

		await handler(createRequest({ method: "GET" }), response);

		expect(response.statusCode).toBe(405);
		expect(response.headers.Allow).toBe("POST");
		expect(response.headers["Cache-Control"]).toBe("no-store");
		expect(createTransport).not.toHaveBeenCalled();
	});

	it("requires JSON and rejects declared oversized requests before delivery", async () => {
		const { createTransport, handler } = createHandler();
		const wrongTypeResponse = createResponse();
		await handler(
			createRequest({ headers: { "content-type": "text/plain" } }),
			wrongTypeResponse
		);
		expect(wrongTypeResponse.statusCode).toBe(415);

		const oversizedResponse = createResponse();
		await handler(
			createRequest({
				headers: {
					"content-type": "application/json",
					"content-length": String(17 * 1024),
				},
			}),
			oversizedResponse
		);
		expect(oversizedResponse.statusCode).toBe(413);
		expect(createTransport).not.toHaveBeenCalled();
	});

	it("returns a generic validation error without creating a transport", async () => {
		const rateLimiter = { consume: vi.fn() };
		const { createTransport, handler } = createHandler({ rateLimiter });
		const response = createResponse();

		await handler(
			createRequest({ body: { ...validBody, email: "invalid" } }),
			response
		);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({
			success: false,
			error: "Invalid form submission.",
		});
		expect(createTransport).not.toHaveBeenCalled();
		expect(rateLimiter.consume).not.toHaveBeenCalled();
	});

	it("rejects a filled honeypot without clearing the form or consuming quota", async () => {
		const rateLimiter = { consume: vi.fn() };
		const { createTransport, handler } = createHandler({ rateLimiter });
		const response = createResponse();

		await handler(
			createRequest({ body: { ...validBody, website: "spam.example" } }),
			response
		);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({
			success: false,
			error: "Invalid form submission.",
		});
		expect(createTransport).not.toHaveBeenCalled();
		expect(rateLimiter.consume).not.toHaveBeenCalled();
	});

	it("sends escaped mail through an injected transport", async () => {
		const { createTransport, handler, sendMail } = createHandler();
		const response = createResponse();

		await handler(
			createRequest({
				body: { ...validBody, message: "Hello <b>not markup</b>" },
			}),
			response
		);

		expect(response.statusCode).toBe(200);
		expect(createTransport).toHaveBeenCalledWith({
			service: "gmail",
			auth: { user: "tinomuzambi@gmail.com", pass: "app-password" },
		});
		expect(sendMail).toHaveBeenCalledTimes(1);
		expect(sendMail.mock.calls[0][0].html).toContain(
			"Hello &lt;b&gt;not markup&lt;/b&gt;"
		);
	});

	it("does not expose mail errors or secrets to the client", async () => {
		const sendMail = vi.fn().mockRejectedValue(new Error("SMTP secret detail"));
		const createTransport = vi.fn(() => ({ sendMail }));
		const { handler, logger } = createHandler({ createTransport });
		const response = createResponse();

		await handler(createRequest(), response);

		expect(response.statusCode).toBe(502);
		expect(JSON.stringify(response.body)).not.toContain("SMTP secret detail");
		expect(JSON.stringify(response.body)).not.toContain("app-password");
		expect(logger.error).toHaveBeenCalled();
	});

	it("reports rejected Gmail credentials as an unavailable service", async () => {
		const authError = Object.assign(new Error("provider detail"), {
			code: "EAUTH",
			responseCode: 535,
		});
		const sendMail = vi.fn().mockRejectedValue(authError);
		const createTransport = vi.fn(() => ({ sendMail }));
		const { handler, logger } = createHandler({ createTransport });
		const response = createResponse();

		await handler(createRequest(), response);

		expect(response.statusCode).toBe(503);
		expect(response.body).toEqual({
			success: false,
			error: "Message could not be delivered.",
		});
		expect(logger.error).toHaveBeenCalledWith(
			"Contact email delivery failed.",
			{ code: "EAUTH", responseCode: 535 }
		);
	});

	it("reports an unavailable service when the server secret is absent", async () => {
		const rateLimiter = { consume: vi.fn() };
		const { createTransport, handler } = createHandler({ env: {}, rateLimiter });
		const response = createResponse();

		await handler(createRequest(), response);

		expect(response.statusCode).toBe(503);
		expect(createTransport).not.toHaveBeenCalled();
		expect(rateLimiter.consume).not.toHaveBeenCalled();
	});
});

describe("client rate-limit identity", () => {
	it("uses Vercel's platform-owned forwarding header in its runtime", () => {
		expect(
			getClientKey(
				createRequest({
					headers: {
						"x-forwarded-for": "198.51.100.99",
						"x-vercel-forwarded-for": "203.0.113.24",
					},
					socket: { remoteAddress: "127.0.0.1" },
				}),
				{ VERCEL: "1" }
			)
		).toBe("203.0.113.24");
	});

	it("ignores caller-supplied proxy headers outside Vercel", () => {
		expect(
			getClientKey(
				createRequest({
					headers: {
						"x-forwarded-for": "198.51.100.99",
						"x-vercel-forwarded-for": "203.0.113.24",
						"x-real-ip": "192.0.2.10",
					},
					socket: { remoteAddress: "127.0.0.1" },
				}),
				{}
			)
		).toBe("127.0.0.1");
	});
});

describe("best-effort rate limiter", () => {
	it("limits each client within a window and allows it after reset", () => {
		let currentTime = 1000;
		const limiter = createRateLimiter({
			limit: 2,
			windowMs: 5000,
			now: () => currentTime,
		});

		expect(limiter.consume("client-a").allowed).toBe(true);
		expect(limiter.consume("client-a").allowed).toBe(true);
		expect(limiter.consume("client-b").allowed).toBe(true);
		expect(limiter.consume("client-a")).toEqual({
			allowed: false,
			retryAfter: 5,
		});

		currentTime += 5000;
		expect(limiter.consume("client-a").allowed).toBe(true);
	});

	it("keeps an active limited client when LRU capacity is exceeded", () => {
		const limiter = createRateLimiter({
			limit: 1,
			windowMs: 5000,
			now: () => 0,
			maxEntries: 2,
		});

		expect(limiter.consume("active-client").allowed).toBe(true);
		expect(limiter.consume("other-client").allowed).toBe(true);
		expect(limiter.consume("active-client").allowed).toBe(false);
		expect(limiter.consume("new-client").allowed).toBe(true);
		expect(limiter.consume("active-client").allowed).toBe(false);
	});

	it("does not charge validation failures against delivery quota", async () => {
		const limiter = createRateLimiter({ limit: 2, windowMs: 2000, now: () => 0 });
		const { handler, sendMail } = createHandler({ rateLimiter: limiter });

		for (let attempt = 0; attempt < 2; attempt += 1) {
			const invalidResponse = createResponse();
			await handler(
				createRequest({ body: { ...validBody, email: "invalid" } }),
				invalidResponse
			);
			expect(invalidResponse.statusCode).toBe(400);
		}

		const firstValidResponse = createResponse();
		await handler(createRequest(), firstValidResponse);
		const secondValidResponse = createResponse();
		await handler(createRequest(), secondValidResponse);
		const limitedResponse = createResponse();
		await handler(createRequest(), limitedResponse);

		expect(firstValidResponse.statusCode).toBe(200);
		expect(secondValidResponse.statusCode).toBe(200);
		expect(limitedResponse.statusCode).toBe(429);
		expect(sendMail).toHaveBeenCalledTimes(2);
	});

	it("returns 429 and a Retry-After header when exhausted", async () => {
		const limiter = createRateLimiter({ limit: 1, windowMs: 2000, now: () => 0 });
		const { handler, sendMail } = createHandler({ rateLimiter: limiter });
		await handler(createRequest(), createResponse());

		const response = createResponse();
		await handler(createRequest(), response);

		expect(response.statusCode).toBe(429);
		expect(response.headers["Retry-After"]).toBe("2");
		expect(sendMail).toHaveBeenCalledTimes(1);
	});
});

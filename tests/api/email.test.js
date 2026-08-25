import { describe, expect, it, vi } from "vitest";

import {
	CONTACT_LIMITS,
	buildMailOptions,
	createEmailHandler,
	createRateLimiter,
	escapeHtml,
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
				website: undefined,
			})
		).toEqual({ ...validBody, website: "" });
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
	it("accepts POST only", async () => {
		const { createTransport, handler } = createHandler();
		const response = createResponse();

		await handler(createRequest({ method: "GET" }), response);

		expect(response.statusCode).toBe(405);
		expect(response.headers.Allow).toBe("POST");
		expect(createTransport).not.toHaveBeenCalled();
	});

	it("requires JSON and rejects oversized requests before delivery", async () => {
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
		const { createTransport, handler } = createHandler();
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
	});

	it("silently accepts the honeypot without sending mail", async () => {
		const { createTransport, handler } = createHandler();
		const response = createResponse();

		await handler(
			createRequest({ body: { ...validBody, website: "spam.example" } }),
			response
		);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ success: true });
		expect(createTransport).not.toHaveBeenCalled();
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

	it("reports an unavailable service when the server secret is absent", async () => {
		const { createTransport, handler } = createHandler({ env: {} });
		const response = createResponse();

		await handler(createRequest(), response);

		expect(response.statusCode).toBe(503);
		expect(createTransport).not.toHaveBeenCalled();
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

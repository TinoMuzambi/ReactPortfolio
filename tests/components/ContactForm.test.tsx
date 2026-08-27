import "@testing-library/jest-dom/vitest";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ContactForm, {
	CONTACT_REQUEST_TIMEOUT_MS,
} from "../../components/ContactForm";

const fillForm = () => {
	fireEvent.change(screen.getByLabelText("Name:"), {
		target: { value: "Tino" },
	});
	fireEvent.change(screen.getByLabelText("Email:"), {
		target: { value: "tino@example.com" },
	});
	fireEvent.change(screen.getByLabelText("Subject:"), {
		target: { value: "Project" },
	});
	fireEvent.change(screen.getByLabelText("Message:"), {
		target: { value: "Can we work together?" },
	});
};

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe("ContactForm", () => {
	it("submits to the local API, includes the honeypot, and clears on success", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal("fetch", fetchMock);
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));

		await screen.findByText("Message sent successfully.");
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith("/api/email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Tino",
				email: "tino@example.com",
				subject: "Project",
				message: "Can we work together?",
				website: "",
			}),
			signal: expect.any(AbortSignal),
		});
		expect(screen.getByLabelText("Name:")).toHaveValue("");
		expect(screen.getByLabelText("Message:")).toHaveValue("");
		expect(screen.getByRole("status")).toHaveClass("form-status--success");
	});

	it("treats non-OK responses as errors and preserves every visible field", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));

		const feedback = await screen.findByText(/Your message was kept/);
		expect(feedback).toHaveAttribute("role", "status");
		expect(feedback).toHaveTextContent("Your message was kept");
		expect(feedback).toHaveClass("form-status--error");
		expect(screen.getByLabelText("Name:")).toHaveValue("Tino");
		expect(screen.getByLabelText("Email:")).toHaveValue("tino@example.com");
		expect(screen.getByLabelText("Subject:")).toHaveValue("Project");
		expect(screen.getByLabelText("Message:")).toHaveValue(
			"Can we work together?"
		);
	});

	it("offers the direct email address when delivery is unavailable", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: false,
				status: 503,
				json: vi.fn().mockResolvedValue({
					contactEmail: "fallback@example.com",
				}),
			})
		);
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));

		const feedback = await screen.findByText(/fallback@example\.com/);
		expect(feedback).toHaveTextContent("temporarily unavailable");
		expect(feedback).not.toHaveTextContent("tino@tinomuzambi.com");
		expect(feedback).toHaveClass("form-status--error");
		expect(screen.getByLabelText("Message:")).toHaveValue(
			"Can we work together?"
		);
	});

	it("does not trust an invalid fallback address from an error response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: false,
				status: 503,
				json: vi.fn().mockResolvedValue({ contactEmail: "not-an-email" }),
			})
		);
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));

		const feedback = await screen.findByText(/temporarily unavailable/);
		expect(feedback).toHaveTextContent(
			"Your message was kept; please try again."
		);
		expect(feedback).not.toHaveTextContent("not-an-email");
	});

	it("prevents duplicate submissions while the first request is pending", async () => {
		let resolveRequest: ((value: { ok: boolean }) => void) | undefined;
		const fetchMock = vi.fn(
			() =>
				new Promise<{ ok: boolean }>((resolve) => {
					resolveRequest = resolve;
				})
		);
		vi.stubGlobal("fetch", fetchMock);
		render(<ContactForm />);
		fillForm();
		const form = screen.getByDisplayValue("Send").closest("form");
		if (!form) throw new Error("Expected the submit control to belong to a form");

		fireEvent.submit(form);
		fireEvent.submit(form);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(screen.getByDisplayValue("Sending…")).toBeDisabled();
		expect(screen.getByRole("status")).toHaveClass("form-status");
		expect(screen.getByRole("status")).not.toHaveClass("form-status--pending");

		resolveRequest?.({ ok: true });
		await waitFor(() => expect(screen.getByDisplayValue("Send")).toBeEnabled());
	});

	it("aborts a stalled request, unlocks the form, and preserves its values", async () => {
		vi.useFakeTimers();
		const fetchMock = vi.fn(
			(_url: string, { signal }: RequestInit) =>
				new Promise<never>((_resolve, reject) => {
					signal?.addEventListener("abort", () =>
						reject(new DOMException("Aborted", "AbortError"))
					);
				})
		);
		vi.stubGlobal("fetch", fetchMock);
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));
		await act(async () => {
			await vi.advanceTimersByTimeAsync(CONTACT_REQUEST_TIMEOUT_MS);
		});

		const requestInit = fetchMock.mock.calls[0]?.[1];
		expect(requestInit?.signal?.aborted).toBe(true);
		expect(screen.getByText(/Sending timed out/)).toHaveClass(
			"form-status--error"
		);
		expect(screen.getByDisplayValue("Send")).toBeEnabled();
		expect(screen.getByLabelText("Message:")).toHaveValue(
			"Can we work together?"
		);
	});

	it("keeps the honeypot out of keyboard navigation", () => {
		render(<ContactForm />);
		const honeypot = document.querySelector<HTMLInputElement>(
			'input[name="website"]'
		);
		const feedback = screen.getByRole("status");
		if (!honeypot) throw new Error("Expected the honeypot input to render");

		expect(honeypot).toHaveAttribute("tabindex", "-1");
		expect(honeypot.closest("div")).toHaveAttribute("aria-hidden", "true");
		expect(feedback).toHaveClass("form-status");
		expect(feedback).not.toHaveClass("form-status--idle");
	});
});

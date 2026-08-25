import "@testing-library/jest-dom/vitest";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ContactForm from "../../components/ContactForm";

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
		});
		expect(screen.getByLabelText("Name:")).toHaveValue("");
		expect(screen.getByLabelText("Message:")).toHaveValue("");
	});

	it("treats non-OK responses as errors and preserves every visible field", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
		render(<ContactForm />);
		fillForm();

		fireEvent.click(screen.getByDisplayValue("Send"));

		const feedback = await screen.findByText(/Your message was kept/);
		expect(feedback).toHaveAttribute("role", "status");
		expect(feedback).toHaveTextContent("Your message was kept");
		expect(screen.getByLabelText("Name:")).toHaveValue("Tino");
		expect(screen.getByLabelText("Email:")).toHaveValue("tino@example.com");
		expect(screen.getByLabelText("Subject:")).toHaveValue("Project");
		expect(screen.getByLabelText("Message:")).toHaveValue(
			"Can we work together?"
		);
	});

	it("prevents duplicate submissions while the first request is pending", async () => {
		let resolveRequest;
		const fetchMock = vi.fn(
			() =>
				new Promise((resolve) => {
					resolveRequest = resolve;
				})
		);
		vi.stubGlobal("fetch", fetchMock);
		render(<ContactForm />);
		fillForm();
		const form = screen.getByDisplayValue("Send").closest("form");

		fireEvent.submit(form);
		fireEvent.submit(form);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(screen.getByDisplayValue("Sending…")).toBeDisabled();

		resolveRequest({ ok: true });
		await waitFor(() => expect(screen.getByDisplayValue("Send")).toBeEnabled());
	});

	it("keeps the honeypot out of keyboard navigation", () => {
		render(<ContactForm />);
		const honeypot = document.querySelector('input[name="website"]');

		expect(honeypot).toHaveAttribute("tabindex", "-1");
		expect(honeypot.closest("div")).toHaveAttribute("aria-hidden", "true");
	});
});

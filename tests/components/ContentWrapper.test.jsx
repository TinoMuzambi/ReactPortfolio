import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContentWrapper from "../../components/ContentWrapper";

const animation = vi.hoisted(() => {
	const timeline = { kill: vi.fn() };
	timeline.to = vi.fn(() => timeline);
	return {
		killTweensOf: vi.fn(),
		set: vi.fn(),
		to: vi.fn(),
		timeline: vi.fn(() => timeline),
		timelineInstance: timeline,
	};
});

vi.mock("gsap", () => ({
	gsap: {
		killTweensOf: animation.killTweensOf,
		set: animation.set,
		to: animation.to,
		timeline: animation.timeline,
	},
}));

vi.mock("../../components/Holder", () => ({
	default: () => <div data-testid="portfolio-holder">Portfolio content</div>,
}));

const setMotionPreference = (matches) => {
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		writable: true,
		value: vi.fn().mockReturnValue({
			matches,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	});
};

describe("ContentWrapper", () => {
	beforeEach(() => {
		window.localStorage.clear();
		setMotionPreference(false);
		animation.killTweensOf.mockClear();
		animation.set.mockClear();
		animation.to.mockClear();
		animation.timeline.mockClear();
		animation.timelineInstance.kill.mockClear();
		animation.timelineInstance.to.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("keeps content available and provides keyboard-operable intro controls", () => {
		render(<ContentWrapper data={{}} />);

		const content = screen.getByTestId("portfolio-holder").parentElement;
		const enter = screen.getByRole("button", { name: "Enter portfolio" });
		expect(content).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /skip intro/i })).toHaveAttribute(
			"href",
			"#about"
		);

		fireEvent.click(enter);

		expect(
			screen.queryByRole("button", { name: "Enter portfolio" })
		).not.toBeInTheDocument();
		expect(content).toHaveFocus();
		expect(window.localStorage.getItem("tino-intro-seen")).toBe("true");
	});

	it("bypasses intro animation when reduced motion is preferred", async () => {
		setMotionPreference(true);
		render(<ContentWrapper data={{}} />);

		await waitFor(() =>
			expect(
				screen.queryByRole("button", { name: "Enter portfolio" })
			).not.toBeInTheDocument()
		);
		expect(screen.getByTestId("portfolio-holder")).toBeInTheDocument();
		expect(animation.timeline).not.toHaveBeenCalled();
	});

	it("cleans up the intro timeline and active tweens", () => {
		const { unmount } = render(<ContentWrapper data={{}} />);
		expect(animation.timeline).toHaveBeenCalledOnce();

		unmount();

		expect(animation.timelineInstance.kill).toHaveBeenCalledOnce();
		expect(animation.killTweensOf).toHaveBeenCalled();
	});
});

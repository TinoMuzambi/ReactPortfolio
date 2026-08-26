import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContentWrapper from "../../components/ContentWrapper";

const animation = vi.hoisted(() => {
	const instances = [];
	const timeline = vi.fn((options = {}) => {
		const instance = {
			options,
			kill: vi.fn(),
			add: vi.fn(),
			addLabel: vi.fn(),
			to: vi.fn(),
		};
		instance.add.mockReturnValue(instance);
		instance.addLabel.mockReturnValue(instance);
		instance.to.mockReturnValue(instance);
		instances.push(instance);
		return instance;
	});
	return {
		instances,
		killTweensOf: vi.fn(),
		set: vi.fn(),
		to: vi.fn(),
		timeline,
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

vi.mock("react-device-detect", () => ({ isMobile: false }));

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
		animation.instances.splice(0);
		animation.killTweensOf.mockClear();
		animation.set.mockClear();
		animation.to.mockClear();
		animation.timeline.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("keeps content as the fallback until the intro is ready", () => {
		vi.stubGlobal("queueMicrotask", vi.fn());
		render(<ContentWrapper data={{}} />);

		const content = screen.getByTestId("portfolio-holder").parentElement;
		const wrapper = content.closest("section");
		expect(content).toBeInTheDocument();
		expect(wrapper).toHaveClass("intro-active");
		expect(wrapper).not.toHaveClass("intro-ready");
	});

	it("matches the production entrance and keeps an accessible icon-only control", async () => {
		render(<ContentWrapper data={{}} />);

		const content = screen.getByTestId("portfolio-holder").parentElement;
		const wrapper = content.closest("section");
		const enter = screen.getByRole("button", { name: "Enter portfolio" });
		expect(content).toBeInTheDocument();
		await waitFor(() =>
			expect(wrapper).toHaveClass("intro-active", "intro-ready")
		);
		expect(enter.querySelector(".enter__label")).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: /skip intro/i })).toHaveAttribute(
			"href",
			"#portfolio-content"
		);

		const startTimeline = animation.instances[0];
		expect(startTimeline.addLabel).toHaveBeenCalledWith("start", 0);
		expect(startTimeline.to).toHaveBeenNthCalledWith(
			1,
			expect.any(NodeList),
			{
				duration: 3,
				ease: "expo.inOut",
				rotation: 90,
				stagger: { amount: 0.4 },
			},
			"start"
		);
		expect(startTimeline.to).toHaveBeenNthCalledWith(
			2,
			expect.any(Array),
			{
				duration: 3,
				ease: "expo.inOut",
				startAt: { opacity: 0, scale: 0.8 },
				scale: 1,
				opacity: 1,
				stagger: { amount: 0.4 },
			},
			"start"
		);
		expect(startTimeline.add).toHaveBeenCalledWith(
			expect.any(Function),
			"start+=2"
		);
	});

	it("matches the production exit before handing focus to content", async () => {
		render(<ContentWrapper data={{}} />);

		const content = screen.getByTestId("portfolio-holder").parentElement;
		const wrapper = content.closest("section");
		const enter = screen.getByRole("button", { name: "Enter portfolio" });
		await waitFor(() => expect(wrapper).toHaveClass("intro-ready"));

		fireEvent.click(enter);

		expect(wrapper).toHaveClass("intro-active", "intro-ready", "intro-exiting");
		expect(enter).toBeInTheDocument();
		const exitTimeline = animation.instances[1];
		expect(exitTimeline.to).toHaveBeenNthCalledWith(
			1,
			enter,
			expect.objectContaining({
				duration: 0.6,
				ease: "back.in",
				opacity: 0,
				scale: 0.2,
			}),
			"start"
		);
		expect(exitTimeline.to).toHaveBeenNthCalledWith(
			2,
			expect.any(NodeList),
			expect.objectContaining({
				duration: 0.8,
				ease: "back.in",
				opacity: 0,
				rotation: "-=20",
				scale: 1.6,
				stagger: { amount: 0.3 },
			}),
			"start"
		);
		expect(exitTimeline.to).toHaveBeenNthCalledWith(
			3,
			expect.any(HTMLCollection),
			expect.objectContaining({
				duration: 0.8,
				ease: "back.out",
				opacity: 1,
				scale: 1,
				startAt: { opacity: 0, scale: 0.8 },
				stagger: { amount: 0.2 },
			}),
			"start+=1"
		);

		act(() => exitTimeline.options.onComplete());

		expect(
			screen.queryByRole("button", { name: "Enter portfolio" })
		).not.toBeInTheDocument();
		expect(wrapper).not.toHaveClass("intro-active", "intro-ready");
		expect(content).toHaveFocus();
	});

	it("keeps focus on the skip-link destination", () => {
		render(<ContentWrapper data={{}} />);
		const content = screen.getByTestId("portfolio-holder").parentElement;

		fireEvent.click(screen.getByRole("link", { name: /skip intro/i }));

		expect(content).toHaveFocus();
	});

	it("runs the intro on every visit", () => {
		const firstVisit = render(<ContentWrapper data={{}} />);
		expect(animation.timeline).toHaveBeenCalledOnce();
		firstVisit.unmount();

		render(<ContentWrapper data={{}} />);
		expect(animation.timeline).toHaveBeenCalledTimes(2);
		expect(
			screen.getByRole("button", { name: "Enter portfolio" })
		).toBeInTheDocument();
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
		const startTimeline = animation.instances[0];

		unmount();

		expect(startTimeline.kill).toHaveBeenCalledOnce();
		expect(animation.killTweensOf).toHaveBeenCalled();
	});

	it("matches production hover/reset without cumulative rotation", async () => {
		const { container } = render(<ContentWrapper data={{}} />);
		const enter = screen.getByRole("button", { name: "Enter portfolio" });
		const circleText = container.querySelectorAll("text.circles__text");
		const circlesSvg = container.querySelector("svg.circles");
		await waitFor(() =>
			expect(container.querySelector("section")).toHaveClass("intro-ready")
		);

		fireEvent.mouseEnter(enter);

		const killedCircleTarget = animation.killTweensOf.mock.calls.find(
			([target]) => target instanceof NodeList
		)?.[0];
		expect([...killedCircleTarget]).toEqual([...circleText]);
		expect(
			animation.killTweensOf.mock.calls.some(([target]) => target === circlesSvg)
		).toBe(false);
		expect(
			animation.to.mock.calls.some(
				([target, options]) =>
					target instanceof NodeList &&
					options.rotation === 210 &&
					options.scale === 0.5 &&
					options.opacity === 0.6 &&
					options.stagger.amount === -0.15
			)
		).toBe(true);

		fireEvent.mouseLeave(enter);

		expect(
			animation.to.mock.calls.some(
				([target, options]) =>
					target instanceof NodeList &&
					options.rotation === 90 &&
					options.scale === 1 &&
					options.opacity === 1 &&
					options.duration === 2
			)
		).toBe(true);
		expect(
			animation.to.mock.calls.some(
				([_target, options]) => typeof options.rotation === "string"
			)
		).toBe(false);
	});
});

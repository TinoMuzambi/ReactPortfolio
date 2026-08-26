import React from "react";
import type {
	HTMLAttributes,
	ImgHTMLAttributes,
	ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Holder from "../../components/Holder";
import type { PortfolioData } from "../../types/portfolio";

vi.mock("next/image", () => ({
	default: function MockImage(props: ImgHTMLAttributes<HTMLImageElement>) {
		return React.createElement("img", props);
	},
}));

vi.mock("framer-motion", async () => {
	const ReactModule = await import("react");
	type MotionProps = Record<string, unknown> & {
		animate?: unknown;
		children?: ReactNode;
	};
	const motionElements: Record<
		string,
		React.ForwardRefExoticComponent<
			MotionProps & React.RefAttributes<HTMLElement>
		>
	> = {};
	const motion = new Proxy(
		{} as Record<string, unknown>,
		{
			get: (_target, element) => {
				if (typeof element !== "string") return undefined;
				motionElements[element] ||= ReactModule.forwardRef(
					function MotionElement(
						props: MotionProps,
						ref: React.ForwardedRef<HTMLElement>
					) {
							const elementProps: Record<string, unknown> = {
								...props,
								ref,
							};
						if (elementProps.animate) {
							elementProps["data-animation-state"] = elementProps.animate;
						}
						["initial", "animate", "variants", "transition"].forEach(
							(name) => delete elementProps[name]
						);
						return ReactModule.createElement(
							element,
							elementProps as HTMLAttributes<HTMLElement>
						);
					}
				);
				return motionElements[element];
			},
		}
	);
	return { motion };
});

vi.mock("react-vertical-timeline-component", async () => {
	const ReactModule = await import("react");
	return {
		VerticalTimeline: function MockTimeline({
			children,
			...props
		}: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
			return ReactModule.createElement("div", props, children);
		},
		VerticalTimelineElement: function MockTimelineElement({
			children,
			icon,
			date,
			className,
		}: {
			children?: ReactNode;
			icon?: ReactNode;
			date?: ReactNode;
			className?: string;
		}) {
			return ReactModule.createElement(
				"div",
				{ className },
				icon,
				ReactModule.createElement("span", null, date),
				children
			);
		},
	};
});

vi.mock("reactjs-popup", async () => {
	const ReactModule = await import("react");
	return {
		default: function MockPopup({
			children,
			modal,
			open,
		}: {
			children?: ReactNode;
			modal?: boolean;
			open?: boolean;
		}) {
			return open
				? ReactModule.createElement(
						"div",
						{ role: modal ? "dialog" : undefined },
						children
					)
				: null;
		},
	};
});

const data: PortfolioData = {
	about: [
		{
			title: "A little about me",
			image: "https://example.com/about.png",
			text: "About biography",
		},
	],
	education: [
		{
			title: "Computer Science",
			institution: "Example University",
			period: "2018–2021",
			description: "Education details",
		},
	],
	experience: [
		{
			title: "Software Engineer",
			institution: "Example Company",
			period: "2021–present",
			description: "Experience details",
			icon: "https://example.com/company.png",
		},
	],
	projects: [
		{
			shortname: "example-project",
			title: "Example Project",
			content: ["Project details"],
			image: "https://example.com/project.png",
			keywords: ["react"],
			featured: true,
		},
	],
	tools: [
		{
			id: 1,
			title: "Example Tool",
			icon: "https://example.com/tool.png",
		},
	],
};

let pendingSignal: AbortSignal | undefined;
const pendingFetch = vi.fn((_url: string, { signal }: RequestInit) => {
	pendingSignal = signal ?? undefined;
	return new Promise<Response>(() => {});
});

describe("Holder", () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.history.replaceState({}, "", "/");
		pendingFetch.mockClear();
		pendingSignal = undefined;
		vi.stubGlobal("fetch", pendingFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("includes every portfolio section in the initial static markup", () => {
		const html = renderToStaticMarkup(<Holder data={data} />);
		const staticDocument = new DOMParser().parseFromString(html, "text/html");

		expect(html).toContain('id="about"');
		expect(html).toContain("About biography");
		expect(html).toContain('id="education"');
		expect(html).toContain("Education details");
		expect(html).toContain('id="experience"');
		expect(html).toContain("Experience details");
		expect(html).toContain('id="portfolio"');
		expect(html).toContain("Project details");
		expect(html).toContain('id="tools"');
		expect(html).toContain("Example Tool");
		expect(
			staticDocument.querySelectorAll(".content-panel[hidden]")
		).toHaveLength(0);
	});

	it("uses semantic links and selects panels without removing their markup", () => {
		const { container } = render(<Holder data={data} />);
		const experienceLink = screen.getByRole("link", { name: "Experience" });

		expect(experienceLink).toHaveAttribute("href", "#experience");
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
			"aria-current",
			"page"
		);
		expect(container.querySelector("#education")).not.toHaveClass("active");

		fireEvent.click(experienceLink);

		expect(container.querySelector("#experience")).toHaveClass("active");
		expect(container.querySelector("#about")).not.toHaveClass("active");
		expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
			"aria-current",
			"page"
		);
		expect(window.localStorage.getItem("tino-last-viewed")).toBe("experience");
	});

	it("honours a direct section hash", async () => {
		window.history.replaceState({}, "", "/#portfolio");
		const { container } = render(<Holder data={data} />);

		await waitFor(() =>
			expect(container.querySelector("#portfolio")).toHaveClass("active")
		);
		expect(screen.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
			"aria-current",
			"page"
		);
	});

	it.each([
		["#edu", "education"],
		["#exp", "experience"],
		["#por", "portfolio"],
		["#too", "tools"],
	])("normalizes the legacy %s hash", async (hash, sectionId) => {
		window.history.replaceState({}, "", `/${hash}`);
		const { container } = render(<Holder data={data} />);

		await waitFor(() =>
			expect(container.querySelector(`#${sectionId}`)).toHaveClass("active")
		);
	});

	it("restores About when navigation returns to a hashless entry", async () => {
		window.localStorage.setItem("tino-last-viewed", "tools");
		window.history.replaceState({}, "", "/#portfolio");
		const { container } = render(<Holder data={data} />);
		await waitFor(() =>
			expect(container.querySelector("#portfolio")).toHaveClass("active")
		);

		window.history.replaceState({}, "", "/");
		window.dispatchEvent(new HashChangeEvent("hashchange"));

		await waitFor(() =>
			expect(container.querySelector("#about")).toHaveClass("active")
		);
		expect(container.querySelector("#tools")).not.toHaveClass("active");
	});

	it("preserves the restored panel when the skip link targets content", async () => {
		window.localStorage.setItem("tino-last-viewed", "tools");
		const { container } = render(<Holder data={data} />);
		await waitFor(() =>
			expect(container.querySelector("#tools")).toHaveClass("active")
		);

		window.history.replaceState({}, "", "/#portfolio-content");
		window.dispatchEvent(new HashChangeEvent("hashchange"));

		await waitFor(() =>
			expect(container.querySelector("#tools")).toHaveClass("active")
		);
		expect(container.querySelector("#about")).not.toHaveClass("active");
	});

	it("falls back to About when the localStorage getter is blocked", () => {
		const storageDescriptor = Object.getOwnPropertyDescriptor(
			window,
			"localStorage"
		);

		try {
			Object.defineProperty(window, "localStorage", {
				configurable: true,
				get: () => {
					throw new DOMException("Blocked", "SecurityError");
				},
			});
			const { container } = render(<Holder data={data} />);
			expect(container.querySelector("#about")).toHaveClass("active");
		} finally {
			if (storageDescriptor) {
				Object.defineProperty(window, "localStorage", storageDescriptor);
			}
		}
	});

	it("switches the active panel without remounting its heading content", () => {
		render(<Holder data={data} />);
		const initialAboutHeading = document.getElementById("about-heading");
		const initialPortfolioHeading = document.getElementById("portfolio-heading");
		if (!initialAboutHeading || !initialPortfolioHeading) {
			throw new Error("Expected both portfolio headings to render");
		}

		expect(initialAboutHeading.closest(".content-panel")).toHaveClass("active");
		expect(initialPortfolioHeading.closest(".content-panel")).not.toHaveClass(
			"active"
		);

		fireEvent.click(screen.getByRole("link", { name: "Portfolio" }));

		expect(document.getElementById("about-heading")).toBe(initialAboutHeading);
		expect(document.getElementById("portfolio-heading")).toBe(
			initialPortfolioHeading
		);
		expect(initialAboutHeading.closest(".content-panel")).not.toHaveClass(
			"active"
		);
		expect(initialPortfolioHeading.closest(".content-panel")).toHaveClass(
			"active"
		);
	});

	it("labels the popup's single focus-managed dialog", async () => {
		pendingFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue({ joke: "A tested joke" }),
		} as unknown as Response);
		render(<Holder data={data} />);

		fireEvent.click(
			await screen.findByRole("button", { name: "A tested joke" })
		);

		const dialog = await screen.findByRole("dialog", {
			name: "A quick joke",
		});
		expect(screen.getAllByRole("dialog")).toHaveLength(1);
		expect(dialog).toHaveAttribute("aria-modal", "true");
		expect(dialog).toHaveAttribute("aria-labelledby", "joke-dialog-title");
	});

	it("shows a safe fallback when the joke service fails", async () => {
		pendingFetch.mockResolvedValueOnce({ ok: false } as Response);
		render(<Holder data={data} />);

		const jokeButton = await screen.findByRole("button", {
			name: "Joke unavailable right now.",
		});
		expect(jokeButton).toBeDisabled();
	});

	it("aborts the joke request when the component unmounts", () => {
		const { unmount } = render(<Holder data={data} />);
		expect(pendingSignal).toBeDefined();

		act(() => unmount());

		expect(pendingSignal?.aborted).toBe(true);
	});
});

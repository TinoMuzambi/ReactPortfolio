import React from "react";
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

vi.mock("next/image", () => ({
	default: function MockImage(props) {
		const imageProps = { ...props };
		delete imageProps.objectFit;
		return React.createElement("img", imageProps);
	},
}));

vi.mock("framer-motion", async () => {
	const ReactModule = await import("react");
	const motion = new Proxy(
		{},
		{
			get: (_target, element) =>
				ReactModule.forwardRef(function MotionElement(props, ref) {
					const elementProps = { ...props, ref };
					["initial", "animate", "variants", "transition"].forEach((name) =>
						delete elementProps[name]
					);
					return ReactModule.createElement(element, elementProps);
				}),
		}
	);
	return { motion };
});

vi.mock("react-vertical-timeline-component", async () => {
	const ReactModule = await import("react");
	return {
		VerticalTimeline: function MockTimeline({ children, ...props }) {
			return ReactModule.createElement("div", props, children);
		},
		VerticalTimelineElement: function MockTimelineElement({
			children,
			icon,
			date,
			className,
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
		default: function MockPopup({ children, open }) {
			return open ? ReactModule.createElement("div", null, children) : null;
		},
	};
});

const data = {
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

const pendingFetch = vi.fn((_url, { signal }) => {
	pendingFetch.signal = signal;
	return new Promise(() => {});
});

describe("Holder", () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.history.replaceState({}, "", "/");
		pendingFetch.mockClear();
		pendingFetch.signal = undefined;
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

	it("shows a safe fallback when the joke service fails", async () => {
		fetch.mockResolvedValueOnce({ ok: false });
		render(<Holder data={data} />);

		const jokeButton = await screen.findByRole("button", {
			name: "Joke unavailable right now.",
		});
		expect(jokeButton).toBeDisabled();
	});

	it("aborts the joke request when the component unmounts", () => {
		const { unmount } = render(<Holder data={data} />);
		expect(pendingFetch.signal).toBeDefined();

		act(() => unmount());

		expect(pendingFetch.signal.aborted).toBe(true);
	});
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Portfolio, { getProjectKey } from "../../components/Portfolio";

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
			get: (_target, element) => {
				return function MotionElement(props) {
					const elementProps = { ...props };
					["initial", "animate", "variants", "transition"].forEach((name) =>
						delete elementProps[name]
					);
					return ReactModule.createElement(element, elementProps);
				};
			},
		}
	);
	return { motion };
});

const projects = [
	{
		shortname: "first",
		title: "First Project",
		content: ["First description"],
		image: "https://example.com/first.png",
		keywords: ["react"],
		featured: true,
	},
	{
		shortname: "not-featured",
		title: "Not Featured",
		content: ["Hidden description"],
		image: "https://example.com/hidden.png",
		keywords: [],
		featured: false,
	},
	{
		shortname: "second",
		title: "Second Project",
		content: ["Second description"],
		image: "https://example.com/second.png",
		keywords: ["javascript"],
		featured: true,
	},
];

describe("Portfolio", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders featured projects deterministically without mutating its input", () => {
		const originalProjects = JSON.stringify(projects);
		vi.spyOn(Math, "random").mockImplementation(() => {
			throw new Error("Project rendering must not use randomness");
		});
		const { rerender } = render(<Portfolio projects={projects} />);

		const projectTitles = () =>
			screen
				.getAllByRole("heading", { level: 3 })
				.map((heading) => heading.textContent);

		expect(projectTitles()).toEqual(["First Project", "Second Project"]);
		expect(screen.queryByText("Not Featured")).not.toBeInTheDocument();
		expect(JSON.stringify(projects)).toBe(originalProjects);

		rerender(<Portfolio projects={projects} />);
		expect(projectTitles()).toEqual(["First Project", "Second Project"]);
		expect(JSON.stringify(projects)).toBe(originalProjects);
	});

	it("derives stable keys from project identity instead of render position", () => {
		expect(getProjectKey(projects[0])).toBe("first|First Project");
		expect(getProjectKey(projects[2])).toBe("second|Second Project");
		expect(getProjectKey({ id: 0 }, 4)).toBe("0");
		expect(getProjectKey({}, 0)).toBe("project-0");
		expect(getProjectKey({}, 1)).toBe("project-1");
	});

	it("renders a featured project safely when its image is absent", () => {
		render(
			<Portfolio
				projects={[
					{
						shortname: "text-only",
						title: "Text-only Project",
						content: ["Still useful without a screenshot"],
						featured: true,
					},
				]}
			/>
		);

		expect(
			screen.getByRole("heading", { name: "Text-only Project" })
		).toBeInTheDocument();
		expect(screen.getByText("Still useful without a screenshot")).toBeVisible();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});
});

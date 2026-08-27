import React from "react";
import type {
	HTMLAttributes,
	ImgHTMLAttributes,
	ReactNode,
} from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Education from "../../components/Education";
import Experience from "../../components/Experience";

vi.mock("next/image", () => ({
	default: function MockImage(props: ImgHTMLAttributes<HTMLImageElement>) {
		return React.createElement("img", props);
	},
}));

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
			date,
			icon,
			className,
		}: {
			children?: ReactNode;
			date?: ReactNode;
			icon?: ReactNode;
			className?: string;
		}) {
			return ReactModule.createElement(
				"article",
				{ className },
				icon,
				date ? ReactModule.createElement("time", null, date) : null,
				children
			);
		},
	};
});

describe("timeline sections", () => {
	it("shows an education period once inside its card", () => {
		render(
			<Education
				education={[
					{
						title: "Computer Science",
						institution: "Example University",
						period: "2018–2021",
						description: "Education details",
					},
				]}
			/>
		);

		expect(screen.getAllByText("2018–2021")).toHaveLength(1);
		expect(screen.getByText("2018–2021")).toHaveClass("date");
		expect(screen.getByText("2018–2021").tagName).toBe("H5");
	});

	it("shows an experience period once inside its card", () => {
		render(
			<Experience
				experience={[
					{
						title: "Software Engineer",
						institution: "Example Company",
						period: "2021–present",
						description: "Experience details",
						icon: "https://example.com/company.png",
					},
				]}
			/>
		);

		expect(screen.getAllByText("2021–present")).toHaveLength(1);
		expect(screen.getByText("2021–present")).toHaveClass("date");
		expect(screen.getByText("2021–present").tagName).toBe("H5");
	});
});

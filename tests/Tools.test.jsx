import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Tools from "../components/Tools";

vi.mock("next/image", () => ({
	default: function MockImage(props) {
		return React.createElement("img", props);
	},
}));

vi.mock("framer-motion", () => ({
	motion: {
		h1: ({ children, ...props }) => {
			const elementProps = { ...props };
			["initial", "animate", "variants"].forEach(
				(name) => delete elementProps[name]
			);
			return <h1 {...elementProps}>{children}</h1>;
		},
		h2: ({ children, ...props }) => {
			const elementProps = { ...props };
			["initial", "animate", "variants"].forEach(
				(name) => delete elementProps[name]
			);
			return <h2 {...elementProps}>{children}</h2>;
		},
		a: ({ children, ...props }) => {
			const elementProps = { ...props };
			elementProps["data-motion-direction"] =
				elementProps.variants?.start?.y === 1000 ? "up" : "down";
			["initial", "animate", "variants", "transition"].forEach(
				(name) => delete elementProps[name]
			);
			return <a {...elementProps}>{children}</a>;
		},
		span: ({ children, ...props }) => {
			const elementProps = { ...props };
			elementProps["data-motion-direction"] =
				elementProps.variants?.start?.y === 1000 ? "up" : "down";
			["initial", "animate", "variants", "transition"].forEach(
				(name) => delete elementProps[name]
			);
			return <span {...elementProps}>{children}</span>;
		},
	},
}));

afterEach(() => {
	vi.restoreAllMocks();
});

describe("Tools", () => {
	it("lets linked and unlinked logos retain their natural aspect ratios", () => {
		render(
			<Tools
				tools={[
					{
						id: 1,
						title: "Wide logo",
						icon: "https://example.com/wide.png",
						link: "https://example.com",
					},
					{
						id: 2,
						title: "Tall logo",
						icon: "https://example.com/tall.png",
					},
				]}
			/>
		);

		for (const logo of screen.getAllByRole("img")) {
			expect(logo).toHaveStyle({ height: "auto", width: "100%" });
		}
	});

	it("uses render position for motion parity with string and zero IDs", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const { container } = render(
			<Tools
				tools={[
					{
						id: "Zero ID",
						title: "String ID",
						icon: "https://example.com/string.png",
						link: "https://example.com/string",
					},
					{
						id: 0,
						title: "Zero ID",
						icon: "https://example.com/zero.png",
					},
				]}
			/>
		);
		const tiles = container.querySelectorAll(
			".tools > .main-content > .tools-img"
		);

		expect(tiles[0]).toHaveAttribute("data-motion-direction", "up");
		expect(tiles[1]).toHaveAttribute("data-motion-direction", "down");
		expect(
			errorSpy.mock.calls.some((call) => call.join(" ").includes("same key"))
		).toBe(false);
	});
});

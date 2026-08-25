import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
		a: ({ children, ...props }) => {
			const elementProps = { ...props };
			["initial", "animate", "variants", "transition"].forEach(
				(name) => delete elementProps[name]
			);
			return <a {...elementProps}>{children}</a>;
		},
		span: ({ children, ...props }) => {
			const elementProps = { ...props };
			["initial", "animate", "variants", "transition"].forEach(
				(name) => delete elementProps[name]
			);
			return <span {...elementProps}>{children}</span>;
		},
	},
}));

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
});

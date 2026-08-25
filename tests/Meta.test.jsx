import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Meta from "../components/Meta";

vi.mock("next/head", async () => {
	const React = await import("react");

	return {
		default: function MockHead({ children }) {
			return React.createElement(
				"div",
				{ "data-testid": "document-head" },
				React.Children.map(children, (child, index) => {
					if (!React.isValidElement(child)) {
						return null;
					}

					const identifier =
						child.props.name ||
						child.props.property ||
						child.props.itemProp ||
						child.props.rel ||
						child.type;

					return React.createElement(
						"span",
						{
							key: child.key || index,
							"data-head-entry": identifier,
						},
						child.props.content || child.props.href || child.props.children
					);
				})
			);
		},
	};
});

describe("Meta", () => {
	it("renders the portfolio defaults", () => {
		render(<Meta />);

		expect(screen.getByTestId("document-head")).toHaveTextContent(
			"Tino Muzambi"
		);
		expect(screen.getByTestId("document-head")).toHaveTextContent(
			"Hi, I'm Tino Muzambi."
		);
	});

	it("uses supplied page metadata without shortening a brief description", () => {
		render(
			<Meta
				title="Project detail"
				description="A concise project summary."
				keywords="project"
				url="https://tinomuzambi.com/project"
				image="https://a.storyblok.com/project.png"
			/>
		);

		expect(screen.getByTestId("document-head")).toHaveTextContent(
			"A concise project summary."
		);
		expect(screen.getByTestId("document-head")).not.toHaveTextContent(
			"A concise project summary...."
		);
	});
});

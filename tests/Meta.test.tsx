import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import Meta from "../components/Meta";

vi.mock("next/head", async () => {
	const React = await import("react");

	return {
		default: function MockHead({ children }: { children: ReactNode }) {
			return React.createElement(
				"div",
				{ "data-testid": "document-head" },
				React.Children.map(children, (child, index) => {
					if (
						!React.isValidElement<{
							name?: string;
							property?: string;
							itemProp?: string;
							rel?: string;
							content?: ReactNode;
							href?: string;
							children?: ReactNode;
						}>(child)
					) {
						return null;
					}

					const identifier =
						child.props.name ||
						child.props.property ||
						child.props.itemProp ||
						child.props.rel ||
						(typeof child.type === "string" ? child.type : "component");

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

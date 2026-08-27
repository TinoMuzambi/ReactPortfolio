import { describe, expect, it, vi } from "vitest";

import { getStoredView, isSupportedView } from "../components/Holder";

describe("stored portfolio views", () => {
	it("accepts only supported view IDs", () => {
		expect(isSupportedView("about")).toBe(true);
		expect(isSupportedView("not-a-panel")).toBe(false);
	});

	it("falls back to About when storage contains an invalid value", () => {
		const storage = {
			getItem: vi.fn().mockReturnValue("not-a-panel"),
		};

		expect(getStoredView(storage)).toBe("about");
	});

	it("falls back to About when storage is unavailable", () => {
		const storage = {
			getItem: vi.fn(() => {
				throw new Error("Storage disabled");
			}),
		};

		expect(getStoredView(storage)).toBe("about");
	});
});

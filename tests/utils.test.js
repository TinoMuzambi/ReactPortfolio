import { describe, expect, it, vi } from "vitest";

import { ellipsize, elipsise, shuffle } from "../utils";

describe("ellipsize", () => {
	it("leaves text within the limit unchanged", () => {
		expect(elipsise("short description", 30)).toBe("short description");
	});

	it("truncates long text to the requested length", () => {
		const result = elipsise("A description that is too long", 18);

		expect(result).toBe("A description t...");
		expect(result).toHaveLength(18);
	});

	it("honors limits shorter than an ellipsis", () => {
		expect(elipsise("long", 2)).toBe("..");
	});

	it("keeps the misspelled export as a backward-compatible alias", () => {
		expect(elipsise).toBe(ellipsize);
	});
});

describe("shuffle", () => {
	it("uses Fisher-Yates swaps and returns the input array", () => {
		const values = ["one", "two", "three"];
		vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0);

		const result = shuffle(values);

		expect(result).toBe(values);
		expect(result).toEqual(["two", "three", "one"]);
	});
});

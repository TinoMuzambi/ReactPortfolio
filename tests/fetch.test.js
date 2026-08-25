import { beforeEach, describe, expect, it, vi } from "vitest";

const { clientGet } = vi.hoisted(() => ({
	clientGet: vi.fn(),
}));

vi.mock("storyblok-js-client", () => ({
	default: class StoryblokClient {
		get(...args) {
			return clientGet(...args);
		}
	},
}));

import {
	getAbout,
	getEducation,
	getExperience,
	getProjects,
	getTools,
} from "../utils/fetch";

describe("Storyblok collection queries", () => {
	beforeEach(() => {
		clientGet.mockReset();
		clientGet.mockResolvedValue({ data: { stories: [] } });
	});

	it.each([
		["projects/", getProjects],
		["about/", getAbout],
		["education/", getEducation],
		["experience/", getExperience],
		["tools/", getTools],
	])("passes %s as a supported query parameter", async (collection, load) => {
		await load();

		expect(clientGet).toHaveBeenCalledWith(
			"cdn/stories",
			expect.objectContaining({ starts_with: collection })
		);
	});

	it.each([
		["projects", getProjects],
		["about", getAbout],
		["education", getEducation],
		["experience", getExperience],
		["tools", getTools],
	])("returns an empty %s collection when Storyblok fails", async (_name, load) => {
		const error = new Error("Storyblok unavailable");
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		clientGet.mockRejectedValueOnce(error);

		await expect(load()).resolves.toEqual([]);
		expect(consoleError).toHaveBeenCalledWith(error);

		consoleError.mockRestore();
	});
});

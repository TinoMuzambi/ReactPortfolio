import { afterEach, describe, expect, it, vi } from "vitest";

import {
	createCmsFixtures,
	createStoryblokClient,
	getAbout,
	getEducation,
	getExperience,
	getPortfolioData,
	getProjects,
	getTools,
	loadCollection,
	normalizeAbout,
	normalizeProject,
	normalizeTool,
} from "../../utils/fetch";

afterEach(() => {
	vi.unstubAllEnvs();
});

const story = (content, name = "example") => ({
	name,
	full_slug: `collection/${name}`,
	content,
});

describe("Storyblok normalizers", () => {
	it("normalizes project text lists and optional values", () => {
		expect(
			normalizeProject(
				story({
					name: "Portfolio",
					shortname: "portfolio",
					title: "Portfolio site",
					content: "First paragraph\nSecond paragraph",
					keywords: "react\nsass",
					featured: true,
				})
			)
		).toEqual({
			name: "Portfolio",
			shortname: "portfolio",
			title: "Portfolio site",
			content: ["First paragraph", "Second paragraph"],
			link: null,
			github: null,
			keywords: ["react", "sass"],
			image: null,
			featured: true,
		});
	});

	it("rejects malformed story fields with their collection path", () => {
		expect(() =>
			normalizeAbout(story({ title: "About", image: 123 }, "bio"))
		).toThrow("about[collection/bio].content.image");
		expect(() =>
			normalizeTool(story({ id: null, title: "React", icon: "/react.png" }))
		).toThrow("content.id");
	});
});

describe("Storyblok collection loading", () => {
	it.each([
		[
			"projects",
			getProjects,
			{ starts_with: "projects/", sort_by: "created_at:desc" },
		],
		[
			"about",
			getAbout,
			{ starts_with: "about/", sort_by: "position:desc" },
		],
		[
			"education",
			getEducation,
			{ starts_with: "education/", sort_by: "position:desc" },
		],
		[
			"experience",
			getExperience,
			{ starts_with: "experience/", sort_by: "published_at:desc" },
		],
		[
			"tools",
			getTools,
			{
				starts_with: "tools/",
				sort_by: "content.title:asc",
				per_page: "100",
			},
		],
	])("preserves the complete %s query contract", async (_name, load, params) => {
		const client = {
			get: vi.fn().mockRejectedValue(new Error("stop after request capture")),
		};

		await expect(load(client)).rejects.toThrow("stop after request capture");
		expect(client.get).toHaveBeenCalledWith("cdn/stories", params);
	});

	it("uses a shared endpoint contract and normalizes stories", async () => {
		const normalize = vi.fn((item) => item.content.title);
		const client = {
			get: vi.fn().mockResolvedValue({
				data: { stories: [story({ title: "One" })] },
			}),
		};

		await expect(
			loadCollection({
				client,
				collection: "about",
				params: { sort_by: "position:desc" },
				normalize,
			})
		).resolves.toEqual(["One"]);
		expect(client.get).toHaveBeenCalledWith("cdn/stories", {
			starts_with: "about/",
			sort_by: "position:desc",
		});
	});

	it("fails loudly when Storyblok returns an empty or malformed response", async () => {
		const emptyClient = {
			get: vi.fn().mockResolvedValue({ data: { stories: [] } }),
		};
		await expect(
			loadCollection({
				client: emptyClient,
				collection: "projects",
				normalize: normalizeProject,
			})
		).rejects.toThrow(
			"Unable to load projects from Storyblok: projects returned no stories"
		);

		const malformedClient = { get: vi.fn().mockResolvedValue({ data: {} }) };
		await expect(
			loadCollection({
				client: malformedClient,
				collection: "tools",
				normalize: normalizeTool,
			})
		).rejects.toThrow("tools response is missing data.stories");
	});

	it("wraps upstream errors with an actionable collection name", async () => {
		const upstream = new Error("401 Unauthorized");
		const client = { get: vi.fn().mockRejectedValue(upstream) };
		const promise = loadCollection({
			client,
			collection: "experience",
			normalize: vi.fn(),
		});

		await expect(promise).rejects.toThrow(
			"Unable to load experience from Storyblok: 401 Unauthorized"
		);
		await promise.catch((error) => expect(error.cause).toBe(upstream));
	});

	it("requires an access token before constructing a client", () => {
		const Client = vi.fn();
		expect(() => createStoryblokClient("", Client)).toThrow(
			"Storyblok access token is missing"
		);
		expect(Client).not.toHaveBeenCalled();
	});
});

describe("portfolio data loading", () => {
	it("uses deterministic fixtures only with the explicit CI opt-in", async () => {
		const shouldNotRun = vi.fn().mockRejectedValue(new Error("should not fetch"));
		vi.stubEnv("CMS_USE_FIXTURES", "true");

		await expect(
			getPortfolioData({
				getProjects: shouldNotRun,
				getAbout: shouldNotRun,
				getEducation: shouldNotRun,
				getExperience: shouldNotRun,
				getTools: shouldNotRun,
			})
		).resolves.toEqual(createCmsFixtures());
		expect(shouldNotRun).not.toHaveBeenCalled();
	});

	it("starts all five collection requests concurrently and preserves the data shape", async () => {
		const calls = [];
		const resolvers = {};
		const collectionNames = [
			"getProjects",
			"getAbout",
			"getEducation",
			"getExperience",
			"getTools",
		];
		const loaders = Object.fromEntries(
			collectionNames.map((name) => [
				name,
				vi.fn(
					() =>
						new Promise((resolve) => {
							calls.push(name);
							resolvers[name] = resolve;
						})
				),
			])
		);

		const loading = getPortfolioData(loaders);
		expect(calls).toEqual(collectionNames);
		collectionNames.forEach((name) => resolvers[name]([name]));

		await expect(loading).resolves.toEqual({
			projects: ["getProjects"],
			about: ["getAbout"],
			education: ["getEducation"],
			experience: ["getExperience"],
			tools: ["getTools"],
		});
	});

	it("propagates a collection failure instead of returning partial props", async () => {
		const success = vi.fn().mockResolvedValue(["content"]);
		await expect(
			getPortfolioData({
				getProjects: success,
				getAbout: success,
				getEducation: vi.fn().mockRejectedValue(new Error("education broken")),
				getExperience: success,
				getTools: success,
			})
		).rejects.toThrow("education broken");
	});
});

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
import type { PortfolioData } from "../../types/portfolio";

afterEach(() => {
	vi.unstubAllEnvs();
});

const story = (content: Record<string, unknown>, name = "example") => ({
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
				per_page: 100,
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
		const normalize = vi.fn((item: unknown) => {
			if (!item || typeof item !== "object" || !("content" in item)) {
				throw new TypeError("Expected a story");
			}
			const content = item.content;
			if (!content || typeof content !== "object" || !("title" in content)) {
				throw new TypeError("Expected story content");
			}
			return content.title;
		});
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

	it("allows an intentionally empty Storyblok collection", async () => {
		const emptyClient = {
			get: vi.fn().mockResolvedValue({ data: { stories: [] } }),
		};
		const normalize = vi.fn();

		await expect(
			loadCollection({
				client: emptyClient,
				collection: "projects",
				normalize,
			})
		).resolves.toEqual([]);
		expect(normalize).not.toHaveBeenCalled();
	});

	it("fails loudly when Storyblok returns a malformed response", async () => {
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
		const constructed = vi.fn();
		class Client {
			constructor() {
				constructed();
			}

			get(): Promise<unknown> {
				return Promise.resolve({});
			}
		}
		expect(() => createStoryblokClient("", Client)).toThrow(
			"Storyblok access token is missing"
		);
		expect(constructed).not.toHaveBeenCalled();
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
		const calls: string[] = [];
		const fixtures = createCmsFixtures();
		const deferredLoader = <T,>(name: string) => {
			let resolve!: (value: T[]) => void;
			const promise = new Promise<T[]>((promiseResolve) => {
				resolve = promiseResolve;
			});
			return {
				load: vi.fn(() => {
					calls.push(name);
					return promise;
				}),
				resolve,
			};
		};
		const projects = deferredLoader<PortfolioData["projects"][number]>(
			"getProjects"
		);
		const about = deferredLoader<PortfolioData["about"][number]>("getAbout");
		const education = deferredLoader<PortfolioData["education"][number]>(
			"getEducation"
		);
		const experience = deferredLoader<PortfolioData["experience"][number]>(
			"getExperience"
		);
		const tools = deferredLoader<PortfolioData["tools"][number]>("getTools");
		const loaders = {
			getProjects: projects.load,
			getAbout: about.load,
			getEducation: education.load,
			getExperience: experience.load,
			getTools: tools.load,
		};
		const collectionNames = [
			"getProjects",
			"getAbout",
			"getEducation",
			"getExperience",
			"getTools",
		];

		const loading = getPortfolioData(loaders);
		expect(calls).toEqual(collectionNames);
		projects.resolve(fixtures.projects);
		about.resolve(fixtures.about);
		education.resolve(fixtures.education);
		experience.resolve(fixtures.experience);
		tools.resolve(fixtures.tools);

		await expect(loading).resolves.toEqual(fixtures);
	});

	it("propagates a collection failure instead of returning partial props", async () => {
		const fixtures = createCmsFixtures();
		await expect(
			getPortfolioData({
				getProjects: vi.fn().mockResolvedValue(fixtures.projects),
				getAbout: vi.fn().mockResolvedValue(fixtures.about),
				getEducation: vi.fn().mockRejectedValue(new Error("education broken")),
				getExperience: vi.fn().mockResolvedValue(fixtures.experience),
				getTools: vi.fn().mockResolvedValue(fixtures.tools),
			})
		).rejects.toThrow("education broken");
	});
});

import StoryblokClient from "storyblok-js-client";
import type { ISbConfig, ISbStoriesParams } from "storyblok-js-client";

import type {
	AboutItem,
	ExperienceItem,
	PortfolioData,
	Project,
	TimelineItem,
	Tool,
} from "../types/portfolio";

const CLIENT_OPTIONS: Pick<ISbConfig, "cache"> = {
	cache: {
		clear: "auto",
		type: "memory",
	},
};

type UnknownRecord = Record<string, unknown>;

interface StoryblokClientLike {
	get(path: string, params: ISbStoriesParams): Promise<unknown>;
}

type StoryblokClientConstructor = new (config: ISbConfig) => StoryblokClientLike;

const isRecord = (value: unknown): value is UnknownRecord =>
	Boolean(value) && typeof value === "object" && !Array.isArray(value);

const storyContext = (collection: string, story: unknown, index: number) => {
	const identity = isRecord(story) && (story.full_slug || story.name);
	return `${collection}[${typeof identity === "string" ? identity : index}]`;
};

const getContent = (story: unknown, context: string): UnknownRecord => {
	if (!isRecord(story)) throw new TypeError(`${context} must be an object`);
	if (!isRecord(story.content)) {
		throw new TypeError(`${context}.content must be an object`);
	}
	return story.content;
};

const requiredString = (
	content: UnknownRecord,
	field: string,
	context: string
): string => {
	const value = content[field];
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new TypeError(`${context}.content.${field} must be a non-empty string`);
	}
	return value;
};

const optionalString = (
	content: UnknownRecord,
	field: string,
	context: string
): string | null => {
	const value = content[field];
	if (value === undefined || value === null || value === "") return null;
	if (typeof value !== "string") {
		throw new TypeError(`${context}.content.${field} must be a string when present`);
	}
	return value;
};

export const normalizeProject = (story: unknown, index = 0): Project => {
	const context = storyContext("projects", story, index);
	const content = getContent(story, context);
	const featured = content.featured ?? false;

	if (typeof featured !== "boolean") {
		throw new TypeError(`${context}.content.featured must be a boolean`);
	}

	return {
		name: requiredString(content, "name", context),
		shortname: requiredString(content, "shortname", context),
		title: requiredString(content, "title", context),
		content: requiredString(content, "content", context).split("\n"),
		link: optionalString(content, "link", context),
		github: optionalString(content, "github", context),
		keywords: requiredString(content, "keywords", context).split("\n"),
		image: optionalString(content, "image", context),
		featured,
	};
};

export const normalizeAbout = (story: unknown, index = 0): AboutItem => {
	const context = storyContext("about", story, index);
	const content = getContent(story, context);

	return {
		title: requiredString(content, "title", context),
		image: requiredString(content, "image", context),
		text: optionalString(content, "text", context),
	};
};

export const normalizeEducation = (story: unknown, index = 0): TimelineItem => {
	const context = storyContext("education", story, index);
	const content = getContent(story, context);

	return {
		title: requiredString(content, "title", context),
		institution: requiredString(content, "institution", context),
		period: requiredString(content, "period", context),
		description: requiredString(content, "description", context),
	};
};

export const normalizeExperience = (story: unknown, index = 0): ExperienceItem => {
	const context = storyContext("experience", story, index);
	const content = getContent(story, context);

	return {
		title: requiredString(content, "title", context),
		institution: requiredString(content, "institution", context),
		period: requiredString(content, "period", context),
		description: requiredString(content, "description", context),
		icon: requiredString(content, "icon", context),
	};
};

export const normalizeTool = (story: unknown, index = 0): Tool => {
	const context = storyContext("tools", story, index);
	const content = getContent(story, context);
	const id = content.id;

	if (
		(typeof id !== "number" || !Number.isFinite(id)) &&
		(typeof id !== "string" || id.trim().length === 0)
	) {
		throw new TypeError(`${context}.content.id must be a number or non-empty string`);
	}

	return {
		id,
		title: requiredString(content, "title", context),
		icon: requiredString(content, "icon", context),
		link: optionalString(content, "link", context),
	};
};

const readStories = (response: unknown, collection: string): unknown[] => {
	const stories =
		isRecord(response) && isRecord(response.data) ? response.data.stories : undefined;
	if (!Array.isArray(stories)) {
		throw new TypeError(`${collection} response is missing data.stories`);
	}
	return stories;
};

const errorMessage = (error: unknown): string => {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Unknown Storyblok error";
};

interface LoadCollectionOptions<T> {
	client: StoryblokClientLike;
	collection: string;
	params?: ISbStoriesParams;
	normalize: (story: unknown, index: number) => T;
}

export const loadCollection = async <T>({
	client,
	collection,
	params = {},
	normalize,
}: LoadCollectionOptions<T>): Promise<T[]> => {
	try {
		const response = await client.get("cdn/stories", {
			starts_with: `${collection}/`,
			...params,
		});
		return readStories(response, collection).map(normalize);
	} catch (error) {
		const wrapped = new Error(
			`Unable to load ${collection} from Storyblok: ${errorMessage(error)}`
		);
		wrapped.cause = error;
		throw wrapped;
	}
};

export const createStoryblokClient = (
	accessToken: string | undefined,
	Client: StoryblokClientConstructor = StoryblokClient
): StoryblokClientLike => {
	if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
		throw new Error("Storyblok access token is missing");
	}
	return new Client({ accessToken, ...CLIENT_OPTIONS });
};

let projectsClient: StoryblokClientLike | undefined;
let profileClient: StoryblokClientLike | undefined;

const getProjectsClient = () => {
	if (!projectsClient) {
		try {
			projectsClient = createStoryblokClient(
				process.env.REACT_APP_STORYBLOK_KEY
			);
		} catch (error) {
			throw new Error(
				`REACT_APP_STORYBLOK_KEY is not configured: ${errorMessage(error)}`
			);
		}
	}
	return projectsClient;
};

const getProfileClient = () => {
	if (!profileClient) {
		try {
			profileClient = createStoryblokClient(
				process.env.REACT_APP_STORYBLOK_KEY2
			);
		} catch (error) {
			throw new Error(
				`REACT_APP_STORYBLOK_KEY2 is not configured: ${errorMessage(error)}`
			);
		}
	}
	return profileClient;
};

export const getProjects = (client = getProjectsClient()) =>
	loadCollection({
		client,
		collection: "projects",
		params: { sort_by: "created_at:desc" },
		normalize: normalizeProject,
	});

export const getAbout = (client = getProfileClient()) =>
	loadCollection({
		client,
		collection: "about",
		params: { sort_by: "position:desc" },
		normalize: normalizeAbout,
	});

export const getEducation = (client = getProfileClient()) =>
	loadCollection({
		client,
		collection: "education",
		params: { sort_by: "position:desc" },
		normalize: normalizeEducation,
	});

export const getExperience = (client = getProfileClient()) =>
	loadCollection({
		client,
		collection: "experience",
		params: { sort_by: "published_at:desc" },
		normalize: normalizeExperience,
	});

export const getTools = (client = getProfileClient()) =>
	loadCollection({
		client,
		collection: "tools",
		params: { sort_by: "content.title:asc", per_page: 100 },
		normalize: normalizeTool,
	});

export const createCmsFixtures = (): PortfolioData => ({
	projects: [
		{
			name: "CI portfolio fixture",
			shortname: "ci-fixture",
			title: "Portfolio fixture",
			content: ["Deterministic content used only for secretless build verification."],
			link: null,
			github: null,
			keywords: ["react"],
			image: "/logo512.png",
			featured: true,
		},
	],
	about: [
		{
			title: "Build fixture",
			image: "/logo512.png",
			text: "Deterministic content used only when CMS_USE_FIXTURES=true.",
		},
	],
	education: [
		{
			title: "Build verification",
			institution: "CI",
			period: "Fixture",
			description: "Secretless compile-time fixture.",
		},
	],
	experience: [
		{
			title: "Build verification",
			institution: "CI",
			period: "Fixture",
			description: "Secretless compile-time fixture.",
			icon: "/logo512.png",
		},
	],
	tools: [
		{
			id: 1,
			title: "Build fixture",
			icon: "/logo512.png",
			link: null,
		},
	],
});

type PortfolioLoaders = Partial<{
	getProjects: () => Promise<Project[]>;
	getAbout: () => Promise<AboutItem[]>;
	getEducation: () => Promise<TimelineItem[]>;
	getExperience: () => Promise<ExperienceItem[]>;
	getTools: () => Promise<Tool[]>;
}>;

export const getPortfolioData = async (
	loaders: PortfolioLoaders = {}
): Promise<PortfolioData> => {
	if (process.env.CMS_USE_FIXTURES === "true") return createCmsFixtures();

	const loadProjects = loaders.getProjects || getProjects;
	const loadAbout = loaders.getAbout || getAbout;
	const loadEducation = loaders.getEducation || getEducation;
	const loadExperience = loaders.getExperience || getExperience;
	const loadTools = loaders.getTools || getTools;

	const [projects, about, education, experience, tools] = await Promise.all([
		loadProjects(),
		loadAbout(),
		loadEducation(),
		loadExperience(),
		loadTools(),
	]);

	return { projects, about, education, experience, tools };
};

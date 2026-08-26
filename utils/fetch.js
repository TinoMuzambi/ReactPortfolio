import StoryblokClient from "storyblok-js-client";

const CLIENT_OPTIONS = {
	cache: {
		clear: "auto",
		type: "memory",
	},
};

const isRecord = (value) =>
	Boolean(value) && typeof value === "object" && !Array.isArray(value);

const storyContext = (collection, story, index) =>
	`${collection}[${story?.full_slug || story?.name || index}]`;

const getContent = (story, context) => {
	if (!isRecord(story)) throw new TypeError(`${context} must be an object`);
	if (!isRecord(story.content)) {
		throw new TypeError(`${context}.content must be an object`);
	}
	return story.content;
};

const requiredString = (content, field, context) => {
	const value = content[field];
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new TypeError(`${context}.content.${field} must be a non-empty string`);
	}
	return value;
};

const optionalString = (content, field, context) => {
	const value = content[field];
	if (value === undefined || value === null || value === "") return null;
	if (typeof value !== "string") {
		throw new TypeError(`${context}.content.${field} must be a string when present`);
	}
	return value;
};

export const normalizeProject = (story, index = 0) => {
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

export const normalizeAbout = (story, index = 0) => {
	const context = storyContext("about", story, index);
	const content = getContent(story, context);

	return {
		title: requiredString(content, "title", context),
		image: requiredString(content, "image", context),
		text: optionalString(content, "text", context),
	};
};

export const normalizeEducation = (story, index = 0) => {
	const context = storyContext("education", story, index);
	const content = getContent(story, context);

	return {
		title: requiredString(content, "title", context),
		institution: requiredString(content, "institution", context),
		period: requiredString(content, "period", context),
		description: requiredString(content, "description", context),
	};
};

export const normalizeExperience = (story, index = 0) => {
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

export const normalizeTool = (story, index = 0) => {
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

const readStories = (response, collection) => {
	const stories = response?.data?.stories;
	if (!Array.isArray(stories)) {
		throw new TypeError(`${collection} response is missing data.stories`);
	}
	return stories;
};

const errorMessage = (error) => {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Unknown Storyblok error";
};

export const loadCollection = async ({
	client,
	collection,
	params,
	normalize,
}) => {
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

export const createStoryblokClient = (accessToken, Client = StoryblokClient) => {
	if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
		throw new Error("Storyblok access token is missing");
	}
	return new Client({ accessToken, ...CLIENT_OPTIONS });
};

let projectsClient;
let profileClient;

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
		params: { sort_by: "content.title:asc", per_page: "100" },
		normalize: normalizeTool,
	});

export const createCmsFixtures = () => ({
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

export const getPortfolioData = async (loaders = {}) => {
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

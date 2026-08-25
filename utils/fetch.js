import StoryblokClient from "storyblok-js-client";

export const getProjects = async () => {
	const Storyblok = new StoryblokClient({
		accessToken: process.env.REACT_APP_STORYBLOK_KEY,
		cache: {
			clear: "auto",
			type: "memory",
		},
	});

	try {
		const response = await Storyblok.get("cdn/stories", {
			starts_with: "projects/",
			sort_by: "created_at:desc",
		});

		return response.data.stories.map((project) => ({
			name: project.content.name,
			shortname: project.content.shortname,
			title: project.content.title,
			content: project.content.content.split("\n"),
			link: project.content.link,
			github: project.content.github,
			keywords: project.content.keywords.split("\n"),
			image: project.content?.image || null,
			featured: project.content.featured || false,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};

const StoryblokTino = new StoryblokClient({
	accessToken: process.env.REACT_APP_STORYBLOK_KEY2,
	cache: {
		clear: "auto",
		type: "memory",
	},
});

export const getAbout = async () => {
	try {
		const response = await StoryblokTino.get("cdn/stories", {
			starts_with: "about/",
			sort_by: "position:desc",
		});

		return response.data.stories.map((item) => ({
			title: item.content.title,
			image: item.content.image,
			text: item.content.text,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getEducation = async () => {
	try {
		const response = await StoryblokTino.get("cdn/stories", {
			starts_with: "education/",
			sort_by: "position:desc",
		});

		return response.data.stories.map((item) => ({
			title: item.content.title,
			institution: item.content.institution,
			period: item.content.period,
			description: item.content.description,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getExperience = async () => {
	try {
		const response = await StoryblokTino.get("cdn/stories", {
			starts_with: "experience/",
			sort_by: "published_at:desc",
		});

		return response.data.stories.map((item) => ({
			title: item.content.title,
			institution: item.content.institution,
			period: item.content.period,
			description: item.content.description,
			icon: item.content.icon,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getTools = async () => {
	try {
		const response = await StoryblokTino.get("cdn/stories", {
			starts_with: "tools/",
			sort_by: "content.title:asc",
			per_page: "100",
		});

		return response.data.stories.map((tool) => ({
			id: tool.content.id,
			title: tool.content.title,
			icon: tool.content.icon,
			link: tool.content?.link,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};

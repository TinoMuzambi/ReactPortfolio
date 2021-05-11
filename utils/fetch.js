import StoryblokClient from "storyblok-js-client";

export const getProjects = async () => {
	const Storyblok = new StoryblokClient({
		accessToken: process.env.REACT_APP_STORYBLOK_KEY,
		cache: {
			clear: "auto",
			type: "memory",
		},
	});

	let projects = [];

	await Storyblok.get("cdn/stories?starts_with=projects/", {
		sort_by: "published_at:desc",
	})
		.then((response) => {
			const strictlyProjects = response.data.stories;
			const prettyprojects = strictlyProjects.map((project) => {
				return {
					name: project.content.name,
					shortname: project.content.shortname,
					title: project.content.title,
					content: project.content.content.split("\n"),
					link: project.content.link,
					github: project.content.github,
					keywords: project.content.keywords.split("\n"),
				};
			});
			projects = prettyprojects;
		})
		.catch((error) => {
			console.error(error);
		});

	return projects;
};

export const getAbout = async () => {
	const Storyblok = new StoryblokClient({
		accessToken: process.env.REACT_APP_STORYBLOK_KEY2,
		cache: {
			clear: "auto",
			type: "memory",
		},
	});

	let about = [];

	await Storyblok.get("cdn/stories?starts_with=about/", {
		sort_by: "published_at:desc",
	})
		.then((response) => {
			console.log(response.data.stories);
		})
		.catch((error) => {
			console.error(error);
		});

	return about;
};

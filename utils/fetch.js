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

const StoryblokTino = new StoryblokClient({
	accessToken: process.env.REACT_APP_STORYBLOK_KEY2,
	cache: {
		clear: "auto",
		type: "memory",
	},
});
export const getAbout = async () => {
	let about = [];

	await StoryblokTino.get("cdn/stories?starts_with=about/", {
		sort_by: "position:desc",
	})
		.then((response) => {
			const strictlyAbout = response.data.stories;
			const prettyAbout = strictlyAbout.map((i) => {
				return {
					title: i.content.title,
					image: i.content.image,
					text: i.content.text,
				};
			});
			about = prettyAbout;
		})
		.catch((error) => {
			console.error(error);
		});

	return about;
};

export const getEducation = async () => {
	let education = [];

	await StoryblokTino.get("cdn/stories?starts_with=education/", {
		sort_by: "position:desc",
	})
		.then((response) => {
			const strictlyEducation = response.data.stories;
			const prettyEducation = strictlyEducation.map((i) => {
				return {
					title: i.content.title,
					institution: i.content.institution,
					period: i.content.period,
					description: i.content.description,
				};
			});
			education = prettyEducation;
			console.log(education);
		})
		.catch((error) => {
			console.error(error);
		});

	return education;
};

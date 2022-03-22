import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import {
	getProjects,
	getAbout,
	getEducation,
	getTools,
	getExperience,
} from "../utils/fetch";

export default function Home({
	projects,
	about,
	education,
	experience,
	tools,
}) {
	console.log(projects);
	return (
		<>
			<Meta />
			<Wrapper data={{ projects, about, education, experience, tools }} />
		</>
	);
}

export const getStaticProps = async () => {
	let projects, about, education, tools, experience;
	const getData = async () => {
		projects = await getProjects();
		about = await getAbout();
		education = await getEducation();
		experience = await getExperience();
		tools = await getTools();
	};

	await getData();

	return {
		props: {
			projects,
			about,
			education,
			experience,
			tools,
		},
	};
};

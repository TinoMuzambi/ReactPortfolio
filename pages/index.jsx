import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import { getProjects, getAbout, getEducation, getTools } from "../utils/fetch";

export default function Home({ projects, about, education, tools }) {
	return (
		<>
			<Meta />
			<Wrapper
				projects={projects}
				about={about}
				education={education}
				tools={tools}
			/>
		</>
	);
}

export const getServerSideProps = async () => {
	let projects, about, education, tools;
	const getData = async () => {
		projects = await getProjects();
		about = await getAbout();
		education = await getEducation();
		tools = await getTools();
	};

	await getData();

	return {
		props: {
			projects,
			about,
			education,
			tools,
		},
	};
};

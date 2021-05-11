import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import { getProjects, getAbout, getEducation } from "../utils/fetch";

export default function Home({ projects, about, education }) {
	return (
		<>
			<Meta />
			<Wrapper projects={projects} about={about} education={education} />
		</>
	);
}

export const getServerSideProps = async () => {
	let projects, about, education;
	const getData = async () => {
		projects = await getProjects();
		about = await getAbout();
		education = await getEducation();
	};

	await getData();

	return {
		props: {
			projects,
			about,
			education,
		},
	};
};

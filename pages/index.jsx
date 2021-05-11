import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import { getProjects, getAbout } from "../utils/fetch";

export default function Home({ projects }) {
	return (
		<>
			<Meta />
			<Wrapper projects={projects} />
		</>
	);
}

export const getServerSideProps = async () => {
	let projects, about;
	const getData = async () => {
		projects = await getProjects();
		about = await getAbout();
	};

	await getData();

	return {
		props: {
			projects,
		},
	};
};

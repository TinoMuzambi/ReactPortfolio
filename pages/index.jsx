import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import { getProjects } from "../utils/fetch";

export default function Home({ projects }) {
	return (
		<>
			<Meta />
			<Wrapper projects={projects} />
		</>
	);
}

export const getServerSideProps = async () => {
	let projects;
	const getData = async () => {
		projects = await getProjects();
	};

	await getData();

	return {
		props: {
			projects,
		},
	};
};

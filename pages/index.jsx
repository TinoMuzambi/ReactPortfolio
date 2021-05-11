import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import { getProjects } from "../utils/fetch";

export default function Home({ data }) {
	return (
		<>
			<Meta />
			<Wrapper data={data} />
		</>
	);
}

export const getServerSideProps = async () => {
	let data;
	const getData = async () => {
		data = await getProjects();
	};

	await getData();

	return {
		props: {
			data,
		},
	};
};

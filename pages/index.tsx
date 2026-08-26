import Wrapper from "../components/ContentWrapper";
import Meta from "../components/Meta";
import type { PortfolioData } from "../types/portfolio";
import { getPortfolioData } from "../utils/fetch";

export default function Home({ projects, about, education, experience, tools }: PortfolioData) {
	return (
		<>
			<Meta />
			<Wrapper data={{ projects, about, education, experience, tools }} />
		</>
	);
}

export const getStaticProps = async () => {
	const data = await getPortfolioData();

	return {
		props: data,
		revalidate: 60,
	};
};

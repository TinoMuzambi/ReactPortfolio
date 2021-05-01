import { useEffect, useState } from "react";
import "./css/App.min.css";
// import Globe from "./components/WorldGlobe";
// import Hero from "./components/Hero";
// import Holder from "./components/Holder";
import Preload from "./pages/Preload";
// import { IoArrowUpCircle } from "react-icons/io5";
import CircularLoader from "./components/CircularLoader";

function App() {
	const [preloadVisible, setPreloadVisible] = useState(true);

	useEffect(() => {
		window.addEventListener("load", () => {
			// Get rid of preloader once everything's loaded
			const preload = document.querySelector(".preload");

			preload.classList.add("preload-finish");
			setTimeout(() => {
				setPreloadVisible(false);
			}, 1000);
		});

		return () => {
			window.removeEventListener("load", () => {
				const preload = document.querySelector(".preload");

				preload.classList.add("preload-finish");
				setTimeout(() => {
					setPreloadVisible(false);
				}, 1000);
			});
		};
	}, []);

	return (
		<>
			{
				preloadVisible && (
					<Preload />
				) /* Preloader for showing before page loads. */
			}
			{/* <header>
				<Globe />
				<Hero />
			</header> */}
			<CircularLoader />
			{/* <main>
				<Holder />
				<IoArrowUpCircle
					className="up-icon"
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				/>
			</main> */}
		</>
	);
}

export default App;

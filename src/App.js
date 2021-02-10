import { useEffect } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
import { IoArrowUpCircle } from "react-icons/io5";

function App() {
	useEffect(() => {
		window.addEventListener("load", () => {
			// Get rid of preloader once everything's loaded
			const preload = document.querySelector(".preload");

			preload.classList.add("preload-finish");
		});

		return () => {
			window.removeEventListener("load", () => {
				const preload = document.querySelector(".preload");

				preload.classList.add("preload-finish");
			});
		};
	}, []);

	return (
		<>
			<header>
				<Globe />
				<Hero />
			</header>
			<main>
				<Preload /> {/* Preloader for showing before page loads. */}
				<Holder />
				<IoArrowUpCircle
					className="up-icon"
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				/>
			</main>
		</>
	);
}

export default App;

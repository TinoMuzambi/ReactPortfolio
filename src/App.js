import { useEffect, useState } from "react";
import "./css/App.min.css";
import Preload from "./pages/Preload";
import Wrapper from "./components/ContentWrapper";

function App() {
	const [preloadVisible, setPreloadVisible] = useState(true);

	const load = () => {
		const preload = document.querySelector(".preload");

		preload.classList.add("preload-finish");
		setTimeout(() => {
			setPreloadVisible(false);
		}, 1000);
	};

	useEffect(() => {
		window.addEventListener("load", () => {
			// Get rid of preloader once everything's loaded
			load();
		});

		return () => {
			window.removeEventListener("load", () => {
				load();
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

			<main>
				<Wrapper />
			</main>
		</>
	);
}

export default App;

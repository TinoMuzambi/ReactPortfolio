import { useEffect, useRef } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
import { IoArrowDownCircle } from "react-icons/io5";
import { updateEls } from "./utils/scrollUtils";

function App() {
	let refreshCurrent = 0;
	const buttonRef = useRef(null);
	const currRef = useRef(refreshCurrent);

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

	useEffect(() => {
		if (refreshCurrent < 50) {
			buttonRef.current.onclick = () => {
				window.scrollTo({
					top: document.body.scrollHeight,
					behavior: "smooth",
				});
			};
			currRef.current = document.body.scrollHeight;
		} else {
			buttonRef.current.onclick = () =>
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			currRef.current = 0;
		}
	}, [refreshCurrent]);

	useEffect(() => {
		window.addEventListener("scroll", updateEls);
		return () => {
			window.removeEventListener("scroll", updateEls);
		};
	}, []);

	return (
		<>
			<Preload /> {/* Preloader for showing before page loads. */}
			<Globe />
			<Hero />
			<button className="enter" ref={buttonRef}>
				<IoArrowDownCircle className="icon" />
			</button>
			<Holder />
		</>
	);
}

export default App;

import { useEffect, useRef, useState, useCallback } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
import { IoArrowDownCircle } from "react-icons/io5";
import { getX, getY, getCurrentScroll } from "./utils/scrollUtils";

function App() {
	const buttonRef = useRef(null);
	const [refreshCurrent, setRefreshCurrent] = useState(0);

	const updateEls = useCallback(() => {
		const transformButton = document.querySelector(".enter");
		const transformSVG = document.querySelector(".enter .icon");
		const items = [transformButton, transformSVG];

		let current = getCurrentScroll();
		items.forEach((el) => {
			el.style.transform = `translate(${getX(current)}px,${getY(
				current
			)}px) rotate(${180 * (current / 100)}deg`;
		});

		requestAnimationFrame(updateEls);
	}, []);

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
			setRefreshCurrent(document.body.scrollHeight);
		} else {
			buttonRef.current.onclick = () =>
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			setRefreshCurrent(0);
		}
	}, [refreshCurrent]);

	useEffect(() => {
		window.addEventListener("scroll", updateEls);
		return () => {
			window.removeEventListener("scroll", updateEls);
		};
	}, [updateEls]);

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

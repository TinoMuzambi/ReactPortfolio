import { useEffect, useRef, useState } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
// import { IoArrowUpCircle } from "react-icons/io5";
import { IoArrowDownCircle } from "react-icons/io5";
import { getX, getY, getCurrentScroll } from "./utils/scrollUtils";

function App() {
	const buttonRef = useRef(null);
	const [refreshCurrent, setRefreshCurrent] = useState(0);

	const updateEls = () => {
		const transformButton = document.querySelector(".enter");
		const transformSVG = document.querySelector(".enter .icon");
		const items = [transformButton, transformSVG];

		let current = getCurrentScroll();
		// console.log(current);
		items.forEach((el) => {
			el.style.transform = `translate(${getX(current)}px,${getY(
				current
			)}px) rotate(${180 * (current / 100)}deg`;
		});

		requestAnimationFrame(updateEls);
	};

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
			{/* <IoArrowUpCircle
				className="up-icon"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			/> */}
		</>
	);
}

export default App;

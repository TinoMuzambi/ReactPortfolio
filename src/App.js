import { useEffect } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
// import { IoArrowUpCircle } from "react-icons/io5";
import { IoArrowDownCircle } from "react-icons/io5";

function App() {
	const getY = (currY) => {
		return currY > 33
			? ((window.innerHeight / 0.68) * 33 * 3) / 100
			: ((window.innerHeight / 0.68) * currY * 3) / 100;
	};

	const updateEls = () => {
		let scrollOffset;
		const transformButton = document.querySelector(".enter");
		const transformSVG = document.querySelector(".enter .icon");
		const items = [transformButton, transformSVG];

		const scrollPos =
			window.scrollY ||
			window.scrollTop ||
			document.getElementsByTagName("html")[0].scrollTop;

		scrollOffset = (scrollPos / window.innerHeight) * 100;

		let current = parseFloat(scrollOffset).toFixed(0);
		// console.log(current);
		items.forEach((el) => {
			el.style.transform = `translate(${
				(window.innerWidth / 2.3) * (current / 100)
			}px,${getY(current)}px) rotate(${180 * (current / 100)}deg`;
		});

		requestAnimationFrame(updateEls);
	};

	useEffect(() => {
		window.addEventListener("load", () => {
			// Get rid of preloader once everything's loaded
			const preload = document.querySelector(".preload");

			preload.classList.add("preload-finish");
		});

		// console.log("height", window.innerHeight);
		// console.log("width", window.innerWidth);

		return () => {
			window.removeEventListener("load", () => {
				const preload = document.querySelector(".preload");

				preload.classList.add("preload-finish");
			});
		};
	}, []);

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
			<button
				className="enter"
				onClick={() =>
					window.scrollTo({
						top: document.body.scrollHeight,
						behavior: "smooth",
					})
				}
			>
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

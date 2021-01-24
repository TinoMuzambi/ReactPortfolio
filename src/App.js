import { useEffect } from "react";
import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import Preload from "./pages/Preload";
// import { IoArrowUpCircle } from "react-icons/io5";
import { IoArrowDownCircle } from "react-icons/io5";

function App() {
	useEffect(() => {
		window.addEventListener("load", () => {
			// Get rid of preloader once everything's loaded
			const preload = document.querySelector(".preload");

			preload.classList.add("preload-finish");
		});

		let scrollOffset;
		window.addEventListener("scroll", (e) => {
			const scrollPos =
				window.scrollY ||
				window.scrollTop ||
				document.getElementsByTagName("html")[0].scrollTop;

			scrollOffset = (scrollPos / window.innerHeight) * 100;

			const transformButton = document.querySelector(".enter");
			// transformButton.style.color = "blue";
			let current = parseFloat(scrollOffset).toFixed(0);
			console.log(current);
			transformButton.style.transform = `translateX(${current}px)`;
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

import React, { useEffect, useState } from "react";
import About from "./About";
import Education from "./Education";
import Experience from "./Experience";
import Portfolio from "./Portfolio";
import Tools from "./Tools";
import {
	FaInfoCircle,
	FaSchool,
	FaBuilding,
	FaCode,
	FaToolbox,
} from "react-icons/fa";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Holder = () => {
	const [joke, setJoke] = useState("");
	const [currentView, setView] = useState("about");
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const contentStyle = {
		background: "rgba(55, 237, 83, 1)",
		padding: "1.5rem",
		borderRadius: "1000px",
		color: "white",
		border: "none",
		textAlign: "center",
	};

	useEffect(() => {
		const getJoke = async () => {
			const result = await fetch(
				"https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,political,racist,sexist,explicit,nsfw&type=single"
			);
			const data = await result.json();
			setJoke(data.joke);

			setLoading(false);
		};
		getJoke();

		const localView = window.localStorage.getItem("tino-last-viewed");
		if (localView) {
			setView(localView);
		}
	}, []);

	useEffect(() => {
		const localView = window.localStorage.getItem("tino-last-viewed");
		if (localView) {
			setView(localView);
		} else {
			window.localStorage.setItem("tino-last-viewed", currentView);
		}
	}, [currentView]);

	const setCurrentView = (view) => {
		// Save last view to localstorage. And open that view when component loads.
		setView(view);
		window.localStorage.setItem("tino-last-viewed", view);
	};

	return (
		<section className="holder">
			<div className="card">
				<div className="sidebar">
					<div className="profile">
						<img src="/assets/me.jpg" alt="me" className="profile-img" />
						<div className="info">
							<h2 className="title">Tino Muzambi</h2>
							<h3 className="subtitle">Full-Stack Web Developer</h3>
						</div>
					</div>
					<ul className="items">
						<li
							className={`item ${currentView === "about" && "active"}`}
							onClick={() => setCurrentView("about")}
						>
							<span>
								<FaInfoCircle className="icon" />
							</span>
							About
						</li>
						<li
							className={`item ${currentView === "edu" && "active"}`}
							onClick={() => setCurrentView("edu")}
						>
							<span>
								<FaSchool className="icon" />
							</span>
							Education
						</li>
						<li
							className={`item ${currentView === "exp" && "active"}`}
							onClick={() => setCurrentView("exp")}
						>
							<span>
								<FaBuilding className="icon" />
							</span>
							Experience
						</li>
						<li
							className={`item ${currentView === "por" && "active"}`}
							onClick={() => setCurrentView("por")}
						>
							<span>
								<FaCode className="icon" />
							</span>
							Portfolio
						</li>
						<li
							className={`item ${currentView === "too" && "active"}`}
							onClick={() => setCurrentView("too")}
						>
							<span>
								<FaToolbox className="icon" />
							</span>
							Tools
						</li>
					</ul>
					<Popup
						open={open}
						modal
						contentStyle={contentStyle}
						onClose={() => setOpen(false)}
					>
						<span className="modal"> {joke} </span>
					</Popup>
					<div className="joke" title={joke} onClick={() => setOpen(true)}>
						<p className="text">{loading ? "Joke loading..." : joke}</p>
						<img
							src="https://image.flaticon.com/icons/png/512/3409/3409731.png"
							alt="man"
							className="icon"
						/>
					</div>
				</div>
				<article className="content">
					{currentView === "about" && <About />}
					{currentView === "edu" && <Education />}
					{currentView === "exp" && <Experience />}
					{currentView === "por" && <Portfolio />}
					{currentView === "too" && <Tools />}
				</article>
			</div>

			<footer>
				<p className="rights">Copyright &copy; Tino Muzambi 2019 - 2021</p>
			</footer>
		</section>
	);
};

export default Holder;

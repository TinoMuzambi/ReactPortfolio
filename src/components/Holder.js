import React, { useEffect, useState } from "react";
import About from "./About";
import Education from "./Education";
import Experience from "./Experience";
import Portfolio from "./Portfolio";
import { IoArrowUpCircle } from "react-icons/io5";
import { FaInfoCircle, FaSchool, FaBuilding, FaCode } from "react-icons/fa";

const Holder = () => {
	const [joke, setJoke] = useState("");
	const [currentView, setCurrentView] = useState("about");
	const [loading, setLoading] = useState(true);

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
	}, []);

	return (
		<div className="holder">
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
					</ul>
					<div className="joke" title={joke}>
						<p className="text">{loading ? "Joke loading..." : joke}</p>
						<img
							src="https://image.flaticon.com/icons/png/512/3409/3409731.png"
							alt="man"
							className="icon"
						/>
					</div>
				</div>
				<div className="content">
					{currentView === "about" && <About />}
					{currentView === "edu" && <Education />}
					{currentView === "exp" && <Experience />}
					{currentView === "por" && <Portfolio />}
				</div>
			</div>
			<IoArrowUpCircle
				className="up-icon"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			/>
			<p className="rights">Copyright © Tino Muzambi 2021</p>
		</div>
	);
};

export default Holder;

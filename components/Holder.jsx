import React, { useEffect, useState } from "react";
import Image from "next/image";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
	FaInfoCircle,
	FaSchool,
	FaBuilding,
	FaCode,
	FaToolbox,
} from "react-icons/fa";

import About from "./About";
import Education from "./Education";
import Experience from "./Experience";
import Portfolio from "./Portfolio";
import Tools from "./Tools";

const Holder = ({ data }) => {
	const [joke, setJoke] = useState("");
	const [currentView, setView] = useState("about");
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const getJoke = async () => {
			const result = await fetch(
				"https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,political,racist,sexist,explicit,nsfw&type=single&safe-mode"
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
						<Image
							src="https://a.storyblok.com/f/114267/1376x1376/fe9da0057b/img_0361.jpg"
							alt="me"
							className="profile-img"
							width={100}
							height={100}
							objectFit="contain"
						/>
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
					<Popup open={open} modal onClose={() => setOpen(false)}>
						<span className="modal"> {joke} </span>
					</Popup>
					<div className="joke" onClick={() => setOpen(true)}>
						<p className="text">{loading ? "Joke loading..." : joke}</p>
						<Image
							src="https://a.storyblok.com/f/114267/512x512/38cf5dc47b/doubt.png"
							alt="man"
							className="icon"
							height={64}
							width={64}
						/>
					</div>
				</div>
				<article className="main-content">
					{currentView === "about" && <About about={data.about} />}
					{currentView === "edu" && <Education education={data.education} />}
					{currentView === "exp" && <Experience experience={data.experience} />}
					{currentView === "por" && <Portfolio projects={data.projects} />}
					{currentView === "too" && <Tools tools={data.tools} />}
				</article>
			</div>

			<footer>
				<p className="rights">
					Copyright © Tino Muzambi 2019 - {new Date().getFullYear()}
				</p>
			</footer>
		</section>
	);
};

export default Holder;

import React, { useCallback, useEffect, useState } from "react";
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

const NAV_ITEMS = [
	{ id: "about", label: "About", Icon: FaInfoCircle },
	{ id: "education", label: "Education", Icon: FaSchool },
	{ id: "experience", label: "Experience", Icon: FaBuilding },
	{ id: "portfolio", label: "Portfolio", Icon: FaCode },
	{ id: "tools", label: "Tools", Icon: FaToolbox },
];

const LEGACY_VIEW_IDS = {
	edu: "education",
	exp: "experience",
	por: "portfolio",
	too: "tools",
};

export const normalizeViewId = (view) => LEGACY_VIEW_IDS[view] || view;

export const isSupportedView = (view) =>
	NAV_ITEMS.some(({ id }) => id === view);

export const getStoredView = (storage) => {
	try {
		const storedView = storage.getItem("tino-last-viewed") || "";
		const normalizedView = normalizeViewId(storedView);
		return isSupportedView(normalizedView) ? normalizedView : "about";
	} catch {
		return "about";
	}
};

const getBrowserStoredView = () => {
	try {
		return getStoredView(window.localStorage);
	} catch {
		return "about";
	}
};

const Holder = ({ data }) => {
	const [joke, setJoke] = useState("");
	const [currentView, setView] = useState("about");
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		let mounted = true;

		const getJoke = async () => {
			try {
				const result = await fetch(
					"https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,political,racist,sexist,explicit,nsfw&type=single&safe-mode",
					{ signal: controller.signal }
				);
				if (!result.ok) throw new Error("Joke service returned an error");
				const response = await result.json();
				if (typeof response.joke !== "string" || !response.joke.trim()) {
					throw new Error("Joke service returned an invalid response");
				}
				if (mounted) setJoke(response.joke);
			} catch (error) {
				if (mounted && error?.name !== "AbortError") {
					setJoke("");
				}
			} finally {
				if (mounted) setLoading(false);
			}
		};

		getJoke();

		return () => {
			mounted = false;
			controller.abort();
		};
	}, []);

	useEffect(() => {
		const syncView = ({ useStoredFallback = false } = {}) => {
			const rawHashView = window.location.hash.slice(1).toLowerCase();
			const hashView = normalizeViewId(rawHashView);

			if (isSupportedView(hashView)) {
				setView(hashView);
			} else if (rawHashView === "portfolio-content") {
				if (useStoredFallback) setView(getBrowserStoredView());
			} else if (useStoredFallback && !rawHashView) {
				setView(getBrowserStoredView());
			} else {
				setView("about");
			}
		};

		const handleHashChange = () => syncView();
		syncView({ useStoredFallback: true });
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const labelJokeDialog = useCallback((content) => {
		if (!content) return;
		// reactjs-popup owns the focus-managed role="dialog" wrapper but does not
		// expose ARIA attributes for it, so label that wrapper from its title.
		const dialog = content.closest('[role="dialog"]');
		if (!dialog) return;

		dialog.setAttribute("aria-labelledby", "joke-dialog-title");
		dialog.setAttribute("aria-modal", "true");
	}, []);

	const setCurrentView = (view) => {
		setView(view);
		try {
			window.localStorage.setItem("tino-last-viewed", view);
		} catch {
			// Selecting a panel must not depend on browser storage.
		}
	};

	const jokeStatus = loading
		? "Joke loading…"
		: joke || "Joke unavailable right now.";

	return (
		<section className="holder">
			<div className="card">
				<aside className="sidebar">
					<div className="profile">
						<Image
							src="https://a.storyblok.com/f/114267/1376x1376/fe9da0057b/img_0361.jpg"
							alt="Portrait of Tino Muzambi"
							className="profile-img"
							width={100}
							height={100}
							style={{ objectFit: "contain" }}
						/>
						<div className="info">
							<h1 className="title">Tino Muzambi</h1>
							<p className="subtitle">Full-Stack Web Developer</p>
						</div>
					</div>
					<nav aria-label="Portfolio sections">
						<ul className="items">
							{NAV_ITEMS.map(({ id, label, Icon }) => (
								<li key={id}>
									<a
										className={`item ${currentView === id ? "active" : ""}`}
										href={`#${id}`}
										onClick={() => setCurrentView(id)}
										aria-current={currentView === id ? "page" : undefined}
									>
										<span aria-hidden="true">
											<Icon className="icon" focusable="false" />
										</span>
										{label}
									</a>
								</li>
							))}
						</ul>
					</nav>
					<Popup open={open} modal onClose={() => setOpen(false)}>
						<div ref={labelJokeDialog} className="modal">
							<h2 id="joke-dialog-title">A quick joke</h2>
							<p>{joke}</p>
							<button type="button" onClick={() => setOpen(false)}>
								Close
							</button>
						</div>
					</Popup>
					<button
						type="button"
						className="joke"
						onClick={() => setOpen(true)}
						disabled={loading || !joke}
						aria-haspopup="dialog"
					>
						<span className="text" aria-live="polite">
							{jokeStatus}
						</span>
						<Image
							src="https://a.storyblok.com/f/114267/512x512/38cf5dc47b/doubt.png"
							alt=""
							aria-hidden="true"
							className="icon"
							height={64}
							width={64}
						/>
					</button>
				</aside>
				<article className="main-content">
					<section
						id="about"
						className={`content-panel ${
							currentView === "about" ? "active" : ""
						}`}
						aria-labelledby="about-heading"
					>
						<About
							about={data.about || []}
							isActive={currentView === "about"}
						/>
					</section>
					<section
						id="education"
						className={`content-panel ${
							currentView === "education" ? "active" : ""
						}`}
						aria-labelledby="education-heading"
					>
						<Education education={data.education || []} />
					</section>
					<section
						id="experience"
						className={`content-panel ${
							currentView === "experience" ? "active" : ""
						}`}
						aria-labelledby="experience-heading"
					>
						<Experience experience={data.experience || []} />
					</section>
					<section
						id="portfolio"
						className={`content-panel ${
							currentView === "portfolio" ? "active" : ""
						}`}
						aria-labelledby="portfolio-heading"
					>
						<Portfolio
							projects={data.projects || []}
							isActive={currentView === "portfolio"}
						/>
					</section>
					<section
						id="tools"
						className={`content-panel ${
							currentView === "tools" ? "active" : ""
						}`}
						aria-labelledby="tools-heading"
					>
						<Tools
							tools={data.tools || []}
							isActive={currentView === "tools"}
						/>
					</section>
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

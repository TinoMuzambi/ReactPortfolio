import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { IoArrowDownCircle } from "react-icons/io5";

import Holder from "./Holder";

const INTRO_STORAGE_KEY = "tino-intro-seen";
const getCircleText = (circlesElement) =>
	circlesElement?.querySelectorAll("text.circles__text");

const ContentWrapper = ({ data }) => {
	const [introActive, setIntroActive] = useState(true);
	const [introReady, setIntroReady] = useState(false);
	const circlesRef = useRef(null);
	const enterRef = useRef(null);
	const enterBackgroundRef = useRef(null);
	const contentRef = useRef(null);
	const focusContentAfterIntroRef = useRef(false);

	useLayoutEffect(() => {
		if (!introActive) {
			if (focusContentAfterIntroRef.current) {
				focusContentAfterIntroRef.current = false;
				contentRef.current?.focus();
			}
			return undefined;
		}

		const reducedMotion = window.matchMedia?.(
			"(prefers-reduced-motion: reduce)"
		);
		let introSeen = false;

		try {
			introSeen = window.localStorage.getItem(INTRO_STORAGE_KEY) === "true";
		} catch {
			// Storage can be disabled. The intro remains optional through its button.
		}

		if (introSeen || reducedMotion?.matches) {
			let cancelled = false;
			queueMicrotask(() => {
				if (!cancelled) setIntroActive(false);
			});
			return () => {
				cancelled = true;
			};
		}

		let cancelled = false;
		queueMicrotask(() => {
			if (!cancelled) setIntroReady(true);
		});

		const circleText = getCircleText(circlesRef.current);
		const enterControl = enterRef.current;
		const enterBackground = enterBackgroundRef.current;
		if (!circleText?.length) return undefined;

		let startTimeline;
		try {
			gsap.set(circleText, { transformOrigin: "50% 50%" });
			startTimeline = gsap.timeline().to(circleText, {
				duration: 3,
				ease: "expo.inOut",
				rotation: 90,
				stagger: { amount: 0.4 },
			});
		} catch {
			// The portfolio and enter control are visible before animation runs.
		}

		const handleMotionPreference = (event) => {
			if (event.matches) setIntroActive(false);
		};
		reducedMotion?.addEventListener?.("change", handleMotionPreference);

		return () => {
			cancelled = true;
			startTimeline?.kill();
			gsap.killTweensOf?.(circleText);
			gsap.killTweensOf?.(enterControl);
			gsap.killTweensOf?.(enterBackground);
			reducedMotion?.removeEventListener?.("change", handleMotionPreference);
		};
	}, [introActive]);

	const dismissIntro = () => {
		try {
			window.localStorage.setItem(INTRO_STORAGE_KEY, "true");
		} catch {
			// Dismissing the intro must not depend on browser storage.
		}
		focusContentAfterIntroRef.current = true;
		setIntroActive(false);
		setIntroReady(false);
	};

	const animateEnter = () => {
		if (!introActive) return;
		const circleText = getCircleText(circlesRef.current);
		gsap.killTweensOf?.(enterBackgroundRef.current);
		gsap.killTweensOf?.(circleText);
		gsap.to?.(enterBackgroundRef.current, {
			duration: 0.8,
			ease: "expo",
			scale: 1.25,
		});
		gsap.to?.(circleText, {
			duration: 0.5,
			ease: "expo",
			rotation: 120,
			opacity: 0.65,
		});
	};

	const resetEnter = () => {
		if (!introActive) return;
		const circleText = getCircleText(circlesRef.current);
		gsap.killTweensOf?.(enterBackgroundRef.current);
		gsap.killTweensOf?.(circleText);
		gsap.to?.(enterBackgroundRef.current, {
			duration: 0.8,
			ease: "elastic.out(1, 0.4)",
			scale: 1,
		});
		gsap.to?.(circleText, {
			duration: 0.8,
			ease: "elastic.out(1, 0.4)",
			rotation: 90,
			opacity: 1,
		});
	};

	return (
		<section
			className={`body demo-3${introActive ? " intro-active" : ""}${
				introActive && introReady ? " intro-ready" : ""
			}`}
		>
			<a className="skip-link" href="#portfolio-content" onClick={dismissIntro}>
				Skip intro and view portfolio
			</a>
			<main>
				{introActive && (
					<>
						<svg
							ref={circlesRef}
							className="circles intro-decoration"
							width="100%"
							height="100%"
							viewBox="0 0 1400 1400"
							aria-hidden="true"
							focusable="false"
						>
							<defs>
								<path
									id="circle-1"
									d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
								/>
								<path
									id="circle-2"
									d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
								/>
								<path
									id="circle-3"
									d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
								/>
								<path
									id="circle-4"
									d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
								/>
							</defs>
							<text className="circles__text circles__text--1">
								<textPath href="#circle-1" textLength="2830">
									Hi, I&apos;m Tino Muzambi.&nbsp;
								</textPath>
							</text>
							<text className="circles__text circles__text--2">
								<textPath href="#circle-2" textLength="2001">
									Full-Stack Web Developer and Lover of Tech.&nbsp;
								</textPath>
							</text>
							<text className="circles__text circles__text--3">
								<textPath href="#circle-3" textLength="1341">
									Welcome to my portfolio site.&nbsp;
								</textPath>
							</text>
							<text className="circles__text circles__text--4">
								<textPath href="#circle-4" textLength="836">
									Built with Next.js, styled with Sass.&nbsp;
								</textPath>
							</text>
						</svg>
						<button
							ref={enterRef}
							type="button"
							className="enter"
							onClick={dismissIntro}
							onMouseEnter={animateEnter}
							onMouseLeave={resetEnter}
							onFocus={animateEnter}
							onBlur={resetEnter}
							aria-controls="portfolio-content"
						>
							<span ref={enterBackgroundRef} className="enter__bg" />
							<span className="enter__text">
								<IoArrowDownCircle aria-hidden="true" focusable="false" />
								<span className="enter__label">Enter portfolio</span>
							</span>
						</button>
					</>
				)}

				<div
					ref={contentRef}
					id="portfolio-content"
					className="content"
					tabIndex="-1"
				>
					<Holder data={data} />
				</div>
			</main>
		</section>
	);
};

export default ContentWrapper;

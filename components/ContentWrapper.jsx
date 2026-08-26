import { useLayoutEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { gsap } from "gsap";
import { IoArrowDownCircle } from "react-icons/io5";

import Holder from "./Holder";

const getCircleText = (circlesElement) =>
	circlesElement?.querySelectorAll("text.circles__text");
const getContentChildren = (contentElement) => contentElement?.children;

const killIntroTweens = (circleText, enterControl, enterBackground) => {
	gsap.killTweensOf?.(circleText);
	gsap.killTweensOf?.(enterControl);
	gsap.killTweensOf?.(enterBackground);
};

const animateIntroHover = (circleText, enterBackground) => {
	gsap.killTweensOf?.(enterBackground);
	gsap.killTweensOf?.(circleText);
	gsap.to?.(enterBackground, {
		duration: 1.3,
		ease: "expo",
		scale: isMobile ? 0.6 : 1.4,
	});
	gsap.to?.(circleText, {
		duration: 0.5,
		ease: "expo",
		rotation: 210,
		scale: 0.5,
		opacity: 0.6,
		stagger: { amount: -0.15 },
	});
};

const resetIntroHover = (circleText, enterBackground) => {
	gsap.killTweensOf?.(enterBackground);
	gsap.killTweensOf?.(circleText);
	gsap.to?.(enterBackground, {
		duration: 2,
		ease: "elastic.out(1, 0.4)",
		scale: 1,
	});
	gsap.to?.(circleText, {
		duration: 2,
		ease: "elastic.out(1, 0.4)",
		rotation: 90,
		scale: 1,
		opacity: 1,
		stagger: { amount: 0.15 },
	});
};

const ContentWrapper = ({ data }) => {
	const [introActive, setIntroActive] = useState(true);
	const [introReady, setIntroReady] = useState(false);
	const [introExiting, setIntroExiting] = useState(false);
	const circlesRef = useRef(null);
	const enterRef = useRef(null);
	const enterBackgroundRef = useRef(null);
	const contentRef = useRef(null);
	const focusContentAfterIntroRef = useRef(false);
	const startTimelineRef = useRef(null);
	const exitTimelineRef = useRef(null);

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

		if (reducedMotion?.matches) {
			let cancelled = false;
			queueMicrotask(() => {
				if (!cancelled) setIntroActive(false);
			});
			return () => {
				cancelled = true;
			};
		}

		let cancelled = false;
		const circleText = getCircleText(circlesRef.current);
		const enterControl = enterRef.current;
		const enterBackground = enterBackgroundRef.current;
		const contentChildren = getContentChildren(contentRef.current);
		const holder = contentRef.current?.querySelector(".holder");
		let mobileHoverTimer;

		const bypassUnavailableIntro = () => {
			queueMicrotask(() => {
				if (!cancelled) setIntroActive(false);
			});
		};

		if (!circleText?.length || !enterControl || !contentChildren?.length) {
			bypassUnavailableIntro();
			return () => {
				cancelled = true;
			};
		}

		try {
			gsap.set(circleText, { transformOrigin: "50% 50%" });
			gsap.set([circleText, contentChildren], { opacity: 0 });
			gsap.set([holder, enterControl], { pointerEvents: "none" });

			startTimelineRef.current = gsap
				.timeline()
				.addLabel("start", 0)
				.to(
					circleText,
					{
						duration: 3,
						ease: "expo.inOut",
						rotation: 90,
						stagger: { amount: 0.4 },
					},
					"start"
				)
				.to(
					[circleText, enterControl],
					{
						duration: 3,
						ease: "expo.inOut",
						startAt: { opacity: 0, scale: 0.8 },
						scale: 1,
						opacity: 1,
						stagger: { amount: 0.4 },
					},
					"start"
				)
				.add(
					() => gsap.set(enterControl, { pointerEvents: "auto" }),
					"start+=2"
				);

			if (isMobile) {
				mobileHoverTimer = window.setTimeout(
					() => animateIntroHover(circleText, enterBackground),
					3000
				);
			}

			queueMicrotask(() => {
				if (!cancelled) setIntroReady(true);
			});
		} catch {
			bypassUnavailableIntro();
		}

		const handleMotionPreference = (event) => {
			if (event.matches) setIntroActive(false);
		};
		reducedMotion?.addEventListener?.("change", handleMotionPreference);

		return () => {
			cancelled = true;
			window.clearTimeout(mobileHoverTimer);
			startTimelineRef.current?.kill();
			exitTimelineRef.current?.kill();
			killIntroTweens(circleText, enterControl, enterBackground);
			gsap.set?.(contentChildren, { opacity: 1, scale: 1 });
			gsap.set?.(holder, { pointerEvents: "auto" });
			startTimelineRef.current = null;
			exitTimelineRef.current = null;
			reducedMotion?.removeEventListener?.("change", handleMotionPreference);
		};
	}, [introActive]);

	const completeIntro = () => {
		setIntroActive(false);
		setIntroReady(false);
		setIntroExiting(false);
	};

	const skipIntro = () => {
		focusContentAfterIntroRef.current = true;
		startTimelineRef.current?.kill();
		exitTimelineRef.current?.kill();
		const contentChildren = getContentChildren(contentRef.current);
		const holder = contentRef.current?.querySelector(".holder");
		gsap.set?.(contentChildren, { opacity: 1, scale: 1 });
		gsap.set?.(holder, { pointerEvents: "auto" });
		completeIntro();
	};

	const exitIntro = () => {
		if (!introActive || introExiting) return;

		const circleText = getCircleText(circlesRef.current);
		const enterControl = enterRef.current;
		const enterBackground = enterBackgroundRef.current;
		const contentChildren = getContentChildren(contentRef.current);
		const holder = contentRef.current?.querySelector(".holder");
		if (!circleText?.length || !enterControl || !contentChildren?.length) {
			skipIntro();
			return;
		}

		focusContentAfterIntroRef.current = true;
		setIntroExiting(true);
		startTimelineRef.current?.kill();
		killIntroTweens(circleText, enterControl, enterBackground);
		gsap.set?.(holder, { pointerEvents: "auto" });
		gsap.set?.(enterControl, { pointerEvents: "none" });
		gsap.set?.(contentRef.current, { opacity: 1 });

		try {
			exitTimelineRef.current = gsap
				.timeline({ onComplete: completeIntro })
				.addLabel("start", 0)
				.to(
					enterControl,
					{
						duration: 0.6,
						ease: "back.in",
						scale: 0.2,
						opacity: 0,
					},
					"start"
				)
				.to(
					circleText,
					{
						duration: 0.8,
						ease: "back.in",
						scale: 1.6,
						opacity: 0,
						rotation: "-=20",
						stagger: { amount: 0.3 },
					},
					"start"
				)
				.to(
					contentChildren,
					{
						duration: 0.8,
						ease: "back.out",
						startAt: { opacity: 0, scale: 0.8 },
						scale: 1,
						opacity: 1,
						stagger: { amount: 0.2 },
					},
					"start+=1"
				);
		} catch {
			skipIntro();
		}
	};

	const animateEnter = () => {
		if (!introActive || !introReady || introExiting) return;
		const circleText = getCircleText(circlesRef.current);
		animateIntroHover(circleText, enterBackgroundRef.current);
	};

	const resetEnter = () => {
		if (!introActive || !introReady || introExiting) return;
		const circleText = getCircleText(circlesRef.current);
		resetIntroHover(circleText, enterBackgroundRef.current);
	};

	return (
		<section
			className={`body demo-3${introActive ? " intro-active" : ""}${
				introActive && introReady ? " intro-ready" : ""
			}${introExiting ? " intro-exiting" : ""}`}
		>
			<a className="skip-link" href="#portfolio-content" onClick={skipIntro}>
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
									{"Hi, I'm Tino Muzambi.\u00a0 \t\t\t"}
								</textPath>
							</text>
							<text className="circles__text circles__text--2">
								<textPath href="#circle-2" textLength="2001">
									Full-Stack Web Developer and Lover of Tech.&nbsp;
								</textPath>
							</text>
							<text className="circles__text circles__text--3">
								<textPath href="#circle-3" textLength="1341">
									Welcome to my portfolio site .&nbsp;
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
							onClick={exitIntro}
							onMouseEnter={animateEnter}
							onMouseLeave={resetEnter}
							onFocus={animateEnter}
							onBlur={resetEnter}
							aria-label="Enter portfolio"
							aria-controls="portfolio-content"
						>
							<span ref={enterBackgroundRef} className="enter__bg" />
							<span className="enter__text">
								<IoArrowDownCircle aria-hidden="true" focusable="false" />
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

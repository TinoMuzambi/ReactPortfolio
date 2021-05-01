import { gsap } from "gsap";
import { useEffect } from "react";
import { IoArrowUpCircle } from "react-icons/io5";

import Holder from "./Holder";

const ContentWrapper = () => {
	useEffect(() => {
		const DOM = {
			content: document.querySelector(".content"),
			enterCtrl: document.querySelector(".enter"),
			enterBackground: document.querySelector(".enter__bg"),
		};

		class Intro {
			constructor(el) {
				// the SVG element
				this.DOM = { el: el };
				// SVG texts
				this.DOM.circleText = [
					...this.DOM.el.querySelectorAll("text.circles__text"),
				];
				// total
				this.circleTextTotal = this.DOM.circleText.length;

				this.setup();
			}
			setup() {
				// need to set the transform origin in the center
				gsap.set(this.DOM.circleText, { transformOrigin: "50% 50%" });
				// hide on start
				gsap.set([this.DOM.circleText, DOM.content.children], {
					opacity: 0,
				});
				// don't allow to hover
				gsap.set(DOM.enterCtrl, { pointerEvents: "none" });

				this.initEvents();
			}
			initEvents() {
				this.enterMouseEnterEv = () => {
					gsap.killTweensOf([DOM.enterBackground, this.DOM.circleText]);

					gsap.to(DOM.enterBackground, {
						duration: 1.3,
						ease: "expo",
						scale: 1.4,
					});
					gsap.to(this.DOM.circleText, {
						duration: 0.5,
						ease: "expo",
						rotation: "+=120",
						scale: 0.5,
						opacity: 0.2,
						stagger: {
							amount: -0.15,
						},
					});
				};
				this.enterMouseLeaveEv = () => {
					//gsap.killTweensOf([DOM.enterBackground,this.DOM.circleText]);

					gsap.to(DOM.enterBackground, {
						duration: 2,
						ease: "elastic.out(1, 0.4)",
						scale: 1,
					});
					gsap.to(this.DOM.circleText, {
						duration: 2,
						ease: "elastic.out(1, 0.4)",
						scale: 1,
						rotation: "-=120",
						opacity: 1,
						stagger: {
							amount: 0.15,
						},
					});
				};
				DOM.enterCtrl.addEventListener("mouseenter", this.enterMouseEnterEv);
				DOM.enterCtrl.addEventListener("mouseleave", this.enterMouseLeaveEv);

				this.enterClickEv = () => this.enter();
				DOM.enterCtrl.addEventListener("click", this.enterClickEv);
			}
			start() {
				this.startTL = gsap
					.timeline()
					.addLabel("start", 0)
					// rotation for all texts
					.to(
						this.DOM.circleText,
						{
							duration: 3,
							ease: "expo.inOut",
							rotation: 90,
							stagger: {
								amount: 0.4,
							},
						},
						"start"
					)
					// scale in the texts & enter button and fade them in
					.to(
						[this.DOM.circleText, DOM.enterCtrl],
						{
							duration: 3,
							ease: "expo.inOut",
							startAt: { opacity: 0, scale: 0.8 },
							scale: 1,
							opacity: 1,
							stagger: {
								amount: 0.4,
							},
						},
						"start"
					)
					// at start+1 allow the hover over the enter ctrl
					.add(() => {
						gsap.set(DOM.enterCtrl, { pointerEvents: "auto" });
					}, "start+=2");
			}
			enter() {
				this.startTL.kill();

				DOM.enterCtrl.removeEventListener("mouseenter", this.enterMouseEnterEv);
				DOM.enterCtrl.removeEventListener("mouseleave", this.enterMouseLeaveEv);
				gsap.set(DOM.enterCtrl, { pointerEvents: "none" });

				gsap.set([DOM.content], { opacity: 1 });

				gsap
					.timeline()
					.addLabel("start", 0)
					.to(
						DOM.enterCtrl,
						{
							duration: 0.6,
							ease: "back.in",
							scale: 0.2,
							opacity: 0,
						},
						"start"
					)
					.to(
						this.DOM.circleText,
						{
							duration: 0.8,
							ease: "back.in",
							scale: 1.6,
							opacity: 0,
							rotation: "-=20",
							stagger: {
								amount: 0.3,
							},
						},
						"start"
					)
					.to(
						[DOM.content.children],
						{
							duration: 0.8,
							ease: "back.out",
							startAt: { opacity: 0, scale: 0.8 },
							scale: 1,
							opacity: 1,
							stagger: {
								amount: 0.2,
							},
						},
						"start+=1"
					);
			}
		}

		const intro = new Intro(document.querySelector(".circles"));

		intro.start();
	}, []);

	return (
		<div className="body demo-3">
			<main>
				<svg
					className="circles"
					width="100%"
					height="100%"
					viewBox="0 0 1400 1400"
				>
					<def>
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
					</def>
					<text className="circles__text circles__text--1">
						<textPath
							className="circles__text-path"
							xlinkHref="#circle-1"
							aria-label=""
							textLength="2830"
						>
							Let life begin I've cleansed all my sins&nbsp;
						</textPath>
					</text>
					<text className="circles__text circles__text--2">
						<textPath
							className="circles__text-path"
							xlinkHref="#circle-2"
							aria-label=""
							textLength="2001"
						>
							Burn all the money absolve all the lies&nbsp;
						</textPath>
					</text>
					<text className="circles__text circles__text--3">
						<textPath
							className="circles__text-path"
							xlinkHref="#circle-3"
							aria-label=""
							textLength="1341"
						>
							We are caged in simulations&nbsp;
						</textPath>
					</text>
					<text className="circles__text circles__text--4">
						<textPath
							className="circles__text-path"
							xlinkHref="#circle-4"
							aria-label=""
							textLength="836"
						>
							But something has changed in us&nbsp;
						</textPath>
					</text>
				</svg>

				<div className="content">
					<main>
						<Holder />
						<IoArrowUpCircle
							className="up-icon"
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						/>
					</main>
				</div>
				<button className="enter">
					<div className="enter__bg"></div>
					<span className="enter__text">Enter</span>
				</button>
			</main>
		</div>
	);
};

export default ContentWrapper;
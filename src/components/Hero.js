import React from "react";
import { IoArrowDownCircle } from "react-icons/io5";

const Hero = () => {
	return (
		<div className="hero">
			<div className="pill">
				<h1 className="title">Welcome to my World.</h1>
			</div>
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
		</div>
	);
};

export default Hero;

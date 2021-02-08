import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";
import Nothing from "./transparency.png";
import { move } from "../data/variants";
import { motion } from "framer-motion";

const WorldGlobe = () => {
	const globeEl = useRef();
	// const points = [
	// 	{ lat: "-25.668501", lng: "27.242371" },
	// 	{ lat: "-33.92487", lng: "18.424055" },
	// 	{ lat: "-17.825167", lng: "31.033510" },
	// ];

	useEffect(() => {
		// Auto-rotate
		globeEl.current.controls().autoRotate = true;
		globeEl.current.controls().autoRotateSpeed = 1;
	}, []);

	return (
		<div className="globe-wrapper">
			<motion.div
				className="globe"
				initial="start"
				animate="end"
				variants={move}
				transition={{
					ease: "easeInOut",
					duration: 3,
				}}
			>
				<Globe
					ref={globeEl}
					width={window.innerWidth}
					height={400}
					globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
					bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
					backgroundImageUrl={Nothing}
				/>
			</motion.div>
		</div>
	);
};

export default WorldGlobe;

import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";
import Nothing from "./transparency.png";
import { useSpring, animated } from "react-spring";

const WorldGlobe = () => {
	const globeEl = useRef();
	// const points = [
	// 	{ lat: "-25.668501", lng: "27.242371" },
	// 	{ lat: "-33.92487", lng: "18.424055" },
	// 	{ lat: "-17.825167", lng: "31.033510" },
	// ];

	const props = useSpring({
		left: 0,
		bottom: 0,
		from: { left: -2000, bottom: 2000 },
		config: { delay: 3 },
	});

	useEffect(() => {
		// Auto-rotate
		globeEl.current.controls().autoRotate = true;
		globeEl.current.controls().autoRotateSpeed = 1;
	}, []);

	return (
		<div className="globe-wrapper">
			<animated.div className="globe" style={props}>
				<Globe
					ref={globeEl}
					width={window.innerWidth}
					height={400}
					globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
					bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
					backgroundImageUrl={Nothing}
				/>
			</animated.div>
		</div>
	);
};

export default WorldGlobe;

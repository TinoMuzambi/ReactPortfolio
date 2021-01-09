import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

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
		globeEl.current.controls().autoRotateSpeed = 0.002;
	}, []);

	return (
		<div className="globe-wrapper">
			<img src="assets/sky.png" alt="sky" className="sky" />
			<div className="globe">
				<Globe
					ref={globeEl}
					width={500}
					height={400}
					globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
					bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
					backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
				/>
			</div>
		</div>
	);
};

export default WorldGlobe;

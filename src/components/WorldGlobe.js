import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const WorldGlobe = () => {
	const globeEl = useRef();
	const points = [
		{ lat: "-25.668501", lng: "27.242371" },
		{ lat: "-33.92487", lng: "18.424055" },
	];

	useEffect(() => {
		// Auto-rotate
		globeEl.current.controls().autoRotate = true;
		globeEl.current.controls().autoRotateSpeed = 0.2;
	}, []);

	return (
		<Globe
			ref={globeEl}
			hexBinPointsData={points}
			hexAltitude={1}
			globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
			bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
			backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
		/>
	);
};

export default WorldGlobe;

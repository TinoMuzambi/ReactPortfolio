import React from "react";
import Globe from "react-globe.gl";

const WorldGlobe = () => {
	return (
		<Globe
			className="globe"
			globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
			bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
			backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
		/>
	);
};

export default WorldGlobe;

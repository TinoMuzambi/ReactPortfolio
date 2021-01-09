import "./App.css";
import Globe from "react-globe.gl";

function App() {
	return (
		<Globe
			globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
			bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
			backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
		/>
	);
}

export default App;

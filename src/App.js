import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import About from "./components/About";
import { IoArrowUpCircle } from "react-icons/io5";

function App() {
	return (
		<>
			<Globe />
			<Hero />
			<About />
			<IoArrowUpCircle
				className="up-icon"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			/>
		</>
	);
}

export default App;

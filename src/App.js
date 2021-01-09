import "./css/App.min.css";
import Globe from "./components/WorldGlobe";
import Hero from "./components/Hero";
import Holder from "./components/Holder";
import { IoArrowUpCircle } from "react-icons/io5";

function App() {
	return (
		<>
			<Globe />
			<Hero />
			<Holder />
			<IoArrowUpCircle
				className="up-icon"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			/>
		</>
	);
}

export default App;

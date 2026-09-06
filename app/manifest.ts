import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Tino Muzambi — Full-Stack Web Developer",
		short_name: "Tino Muzambi",
		description: "Professional portfolio for Tino Muzambi.",
		start_url: "/",
		display: "standalone",
		background_color: "#F6F8FB",
		theme_color: "#F6F8FB",
		icons: [
			{ src: "/logo192.png", sizes: "192x192", type: "image/png" },
			{ src: "/logo512.png", sizes: "512x512", type: "image/png" },
		],
	};
}

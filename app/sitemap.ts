import type { MetadataRoute } from "next";

const routes = ["", "/contact", "/resume.json", "/projects.json"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	return routes.map((route) => ({
		url: `https://tinomuzambi.com${route}`,
		changeFrequency: route === "" ? "monthly" : "yearly",
		priority: route === "" ? 1 : 0.7,
	}));
}

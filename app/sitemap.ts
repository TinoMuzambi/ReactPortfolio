import type { MetadataRoute } from "next";

import { caseStudies } from "@/content/case-studies";

const routes = ["", "/contact", "/resume.json", "/projects.json"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
		url: `https://tinomuzambi.com${route}`,
		changeFrequency: route === "" ? "monthly" : "yearly",
		priority: route === "" ? 1 : 0.7,
	}));
	const workRoutes: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
		url: `https://tinomuzambi.com/work/${caseStudy.slug}`,
		changeFrequency: "yearly",
		priority: 0.8,
	}));

	return [...staticRoutes, ...workRoutes];
}

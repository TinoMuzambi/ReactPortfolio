import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: "https://tinomuzambi.com/sitemap.xml",
		host: "https://tinomuzambi.com",
	};
}

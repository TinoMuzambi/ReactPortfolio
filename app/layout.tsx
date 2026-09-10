import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/noto-sans";

import { personJsonLd } from "@/lib/public-data";

import "./globals.css";

const siteUrl = "https://tinomuzambi.com";
const description =
	"Tino Muzambi is a full-stack developer in Cape Town with strong software foundations and fluent AI-assisted delivery.";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Tino Muzambi | Full-Stack Web Developer",
		template: "%s | Tino Muzambi",
	},
	description,
	applicationName: "Tino Muzambi Portfolio",
	authors: [{ name: "Tino Muzambi", url: siteUrl }],
	creator: "Tino Muzambi",
	publisher: "Tino Muzambi",
	category: "technology",
	classification: "Professional portfolio",
	keywords: [
		"Tino Muzambi",
		"full-stack developer",
		"software engineer",
		"TypeScript",
		"React",
		"Next.js",
		"data science",
		"Cape Town",
	],
	referrer: "origin-when-cross-origin",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
		types: {
			"text/plain": "/llms.txt",
			"application/json": "/cv.json",
			"application/pdf": "/tinotenda-muzambi-cv.pdf",
		},
	},
	openGraph: {
		type: "profile",
		url: siteUrl,
		title: "Tino Muzambi | Full-Stack Web Developer",
		description,
		siteName: "Tino Muzambi",
		locale: "en_ZA",
		images: [
			{
				url: "/tino-muzambi-graduation.png",
				width: 1254,
				height: 1254,
				alt: "Portrait of Tino Muzambi in graduation attire",
			},
		],
	},
	twitter: {
		card: "summary",
		title: "Tino Muzambi | Full-Stack Web Developer",
		description,
		images: ["/tino-muzambi-graduation.png"],
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/logo192.png",
	},
	manifest: "/manifest.webmanifest",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "light",
	themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const jsonLd = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

	return (
		<html lang="en-ZA">
			<body>
				{children}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: jsonLd }}
				/>
			</body>
		</html>
	);
}

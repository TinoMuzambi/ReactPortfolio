import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/newsreader";

import { personJsonLd } from "@/lib/public-data";

import "./globals.css";

const siteUrl = "https://tinomuzambi.com";
const description =
	"Tino Muzambi is a full-stack web developer in Cape Town with experience building web platforms, serverless systems and data-focused products.";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Tino Muzambi — Full-Stack Web Developer",
		template: "%s — Tino Muzambi",
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
			"application/json": "/resume.json",
		},
	},
	openGraph: {
		type: "profile",
		url: siteUrl,
		title: "Tino Muzambi — Full-Stack Web Developer",
		description,
		siteName: "Tino Muzambi",
		locale: "en_ZA",
		images: [
			{
				url: "/logo512.png",
				width: 512,
				height: 512,
				alt: "Tino Muzambi",
			},
		],
	},
	twitter: {
		card: "summary",
		title: "Tino Muzambi — Full-Stack Web Developer",
		description,
		images: ["/logo512.png"],
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
	themeColor: "#f1f0f8",
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

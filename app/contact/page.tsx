import type { Metadata } from "next";
import Link from "next/link";

import { portfolio } from "@/content/portfolio";

export const metadata: Metadata = {
	title: "Contact",
	description: "Contact Tino Muzambi about software engineering and web development work.",
	alternates: { canonical: "/contact" },
};

export default function ContactPage() {
	return (
		<main className="contact-page shell">
			<Link className="text-link" href="/">
				Back to portfolio
			</Link>
			<div>
				<h1>Start with an email.</h1>
				<p>
					For roles, engineering collaboration or project enquiries, email Tino directly.
					This route has no third-party form, tracking script or exposed delivery credential.
				</p>
				<a className="contact-link" href={`mailto:${portfolio.profile.email}`}>
					{portfolio.profile.email}
				</a>
			</div>
			<address>
				{portfolio.profile.name}<br />
				{portfolio.profile.location}
			</address>
		</main>
	);
}

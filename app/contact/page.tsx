import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/decision-files";
import { portfolio } from "@/content/portfolio";

export const metadata: Metadata = {
	title: "Contact",
	description: "Contact Tino Muzambi about software engineering and web development work.",
	alternates: { canonical: "/contact" },
};

export default function ContactPage() {
	return (
		<>
			<SiteHeader />
			<main className="contact-page page-shell">
				<Link className="back-link" href="/">Back to portfolio</Link>
				<div className="contact-statement">
					<p className="case-type">Direct contact</p>
					<h1>Start with the work. Continue by email.</h1>
					<p>
						For roles, engineering collaboration or project enquiries, email Tino
						directly. No form intermediary or third-party tracker is involved.
					</p>
					<a className="contact-email" href={`mailto:${portfolio.profile.email}`}>
						{portfolio.profile.email}
					</a>
				</div>
				<address>{portfolio.profile.location}</address>
			</main>
			<SiteFooter />
		</>
	);
}

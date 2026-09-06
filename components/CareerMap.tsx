"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import { portfolio } from "@/content/portfolio";

const trackDefinitions = [
	{
		id: "build",
		label: "Build",
		description: "Web products, APIs and delivery",
	},
	{
		id: "data",
		label: "Data",
		description: "Analysis, research and machine learning",
	},
	{
		id: "lead",
		label: "Lead",
		description: "Teams, standards and teaching",
	},
] as const;

type Track = (typeof trackDefinitions)[number]["id"];

interface EvidenceEntry {
	readonly id: string;
	readonly kind: "Role" | "Project" | "Study";
	readonly period: string;
	readonly title: string;
	readonly context: string;
	readonly details: readonly string[];
	readonly tracks: readonly Track[];
	readonly href?: string;
}

const experienceById = new Map(
	portfolio.experience.map((entry) => [entry.id, entry] as const)
);
const educationById = new Map(
	portfolio.education.map((entry) => [entry.id, entry] as const)
);
const projectById = new Map(portfolio.projects.map((entry) => [entry.id, entry] as const));

function experienceEntry(id: string, tracks: readonly Track[]): EvidenceEntry {
	const entry = experienceById.get(id);
	if (!entry) throw new Error(`Missing experience entry: ${id}`);

	return {
		id: entry.id,
		kind: "Role",
		period: entry.period,
		title: entry.role,
		context: entry.organisation,
		details: entry.highlights,
		tracks,
	};
}

function educationEntry(id: string, tracks: readonly Track[]): EvidenceEntry {
	const entry = educationById.get(id);
	if (!entry) throw new Error(`Missing education entry: ${id}`);

	return {
		id: entry.id,
		kind: "Study",
		period: entry.period,
		title: entry.qualification,
		context: entry.institution,
		details: entry.details,
		tracks,
	};
}

function projectEntry(
	id: string,
	period: string,
	context: string,
	tracks: readonly Track[]
): EvidenceEntry {
	const entry = projectById.get(id);
	if (!entry) throw new Error(`Missing project entry: ${id}`);

	return {
		id: entry.id,
		kind: "Project",
		period,
		title: entry.name,
		context,
		details: [entry.summary],
		tracks,
		href: entry.sourceUrl ?? entry.referenceUrl ?? entry.liveUrl,
	};
}

const mscPeriod = educationById.get("uct-msc-data-science")?.period ?? "2024 – 2026";
const honoursPeriod =
	educationById.get("uct-bsc-hons-computer-science")?.period ?? "2021 – 2022";

const evidenceEntries: readonly EvidenceEntry[] = [
	experienceEntry("ovex-intermediate-developer", ["build"]),
	projectEntry(
		"music-rec-path-signatures",
		mscPeriod,
		"Music recommendation research",
		["build", "data"]
	),
	educationEntry("uct-msc-data-science", ["data"]),
	experienceEntry("uct-web-developer", ["build", "data", "lead"]),
	experienceEntry("uct-adp-web-developer", ["build", "lead"]),
	experienceEntry("vodacom-solutions-management-intern", ["build", "lead"]),
	experienceEntry("123tutors-frontend-developer", ["build"]),
	experienceEntry("four-minute-medicine-full-stack-developer", ["build"]),
	projectEntry("advice", honoursPeriod, "Honours project", ["build", "data"]),
	educationEntry("uct-bsc-hons-computer-science", ["build", "data"]),
	experienceEntry("varsity-newspaper-lead-developer", ["build", "lead"]),
	experienceEntry("elle-zeka-full-stack-developer", ["build"]),
	experienceEntry("uct-computer-science-tutor", ["lead"]),
	experienceEntry("electrum-software-developer-intern", ["build"]),
];

const trackBounds = Object.fromEntries(
	trackDefinitions.map((track) => {
		const first = evidenceEntries.findIndex((entry) => entry.tracks.includes(track.id));
		const last = evidenceEntries
			.map((entry) => entry.tracks.includes(track.id))
			.lastIndexOf(true);
		return [track.id, { first, last }];
	})
) as Readonly<Record<Track, { readonly first: number; readonly last: number }>>;

const trackPosition = (track: Track) => {
	const index = trackDefinitions.findIndex((definition) => definition.id === track);
	return 18 + index * 32;
};

function connectorStyle(tracks: readonly Track[]): CSSProperties {
	const positions = tracks.map(trackPosition);
	const start = Math.min(...positions);
	const end = Math.max(...positions);

	return {
		left: `${start}%`,
		width: `${end - start}%`,
	};
}

export default function CareerMap() {
	const [activeTrack, setActiveTrack] = useState<Track | null>(null);

	return (
		<div className="career-map">
			<div className="route-controls" aria-label="Highlight one career route">
				<button
					className="route-control route-control-all"
					type="button"
					aria-pressed={activeTrack === null}
					onClick={() => setActiveTrack(null)}
				>
					<span>All routes</span>
					<small>Read the complete map</small>
				</button>
				{trackDefinitions.map((track) => (
					<button
						className={`route-control route-control-${track.id}`}
						type="button"
						key={track.id}
						aria-pressed={activeTrack === track.id}
						onClick={() =>
							setActiveTrack((current) => (current === track.id ? null : track.id))
						}
					>
						<span>{track.label}</span>
						<small>{track.description}</small>
					</button>
				))}
			</div>

			<p className="sr-only" aria-live="polite">
				{activeTrack
					? `Highlighting the ${activeTrack} route. All evidence remains visible.`
					: "Showing all career routes."}
			</p>

			<ol className="evidence-map">
				{evidenceEntries.map((entry, index) => {
					const isDimmed = activeTrack !== null && !entry.tracks.includes(activeTrack);
					const positions = entry.tracks.map(trackPosition);
					const connectorClass = `connector-${entry.tracks.join("-")}`;
					const rowStyle = {
						"--route-delay": `${index * 55}ms`,
					} as CSSProperties;

					return (
						<li
							className="evidence-row"
							data-dimmed={isDimmed}
							key={entry.id}
							style={rowStyle}
						>
							<p className="evidence-period">{entry.period}</p>
							<div className="route-plot" aria-hidden="true">
								{trackDefinitions.map((track) => {
									const bounds = trackBounds[track.id];
									return (
										<span
											className={`route-segment route-segment-${track.id}`}
											data-first={index === bounds.first}
											data-last={index === bounds.last}
											data-outside={index < bounds.first || index > bounds.last}
											data-muted={activeTrack !== null && activeTrack !== track.id}
											key={track.id}
											style={{ left: `${trackPosition(track.id)}%` }}
										/>
									);
								})}
								{entry.tracks.length > 1 ? (
									<span
										className={`route-connector ${connectorClass}`}
										style={connectorStyle(entry.tracks)}
									/>
								) : null}
								{entry.tracks.map((track, trackIndex) => (
									<span
										className={`route-marker route-marker-${track}`}
										key={track}
										style={{ left: `${positions[trackIndex]}%` }}
									/>
								))}
							</div>
							<article className="evidence-content">
								<div className="evidence-meta">
									<span>{entry.kind}</span>
									<span aria-hidden="true">/</span>
									<span>{entry.tracks.map((track) => track[0].toUpperCase() + track.slice(1)).join(" + ")}</span>
								</div>
								<h3>{entry.title}</h3>
								<p className="evidence-context">{entry.context}</p>
								{entry.details.length > 0 ? (
									<ul>
										{entry.details.map((detail) => (
											<li key={detail}>{detail}</li>
										))}
									</ul>
								) : (
									<p className="evidence-unavailable">
										No public project details are available for this current role.
									</p>
								)}
								{entry.href ? (
									<a href={entry.href} target="_blank" rel="noreferrer">
										Open supporting work
										<span className="sr-only"> (opens in a new tab)</span>
									</a>
								) : null}
							</article>
						</li>
					);
				})}
			</ol>
		</div>
	);
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";

import {
	evidenceLenses,
	orderEvidence,
	type EvidenceItem,
	type EvidenceLens,
} from "@/lib/evidence";

interface EvidenceIndexProps {
	readonly items: readonly EvidenceItem[];
}

const lensLabel = (lens: EvidenceLens) =>
	evidenceLenses.find((candidate) => candidate.id === lens)?.label ?? lens;

export default function EvidenceIndex({ items }: EvidenceIndexProps) {
	const [lens, setLens] = useState<EvidenceLens>("full-stack");
	const itemElements = useRef(new Map<string, HTMLLIElement>());
	const previousPositions = useRef(new Map<string, DOMRect>());
	const orderedItems = orderEvidence(items, lens);
	const activeLens = evidenceLenses.find((candidate) => candidate.id === lens);

	const changeLens = (nextLens: EvidenceLens) => {
		if (nextLens === lens) return;

		previousPositions.current = new Map(
			Array.from(itemElements.current, ([id, element]) => [
				id,
				element.getBoundingClientRect(),
			])
		);
		setLens(nextLens);
	};

	useLayoutEffect(() => {
		if (
			previousPositions.current.size === 0 ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			previousPositions.current.clear();
			return;
		}

		for (const [id, element] of itemElements.current) {
			const previous = previousPositions.current.get(id);
			if (!previous) continue;

			const current = element.getBoundingClientRect();
			const offset = previous.top - current.top;
			if (Math.abs(offset) < 1) continue;

			element.animate(
				[
					{ transform: `translateY(${offset}px)` },
					{ transform: "translateY(0)" },
				],
				{
					duration: 360,
					easing: "cubic-bezier(0.22, 1, 0.36, 1)",
				}
			);
		}

		previousPositions.current.clear();
	}, [lens]);

	return (
		<div className="evidence-index" data-lens={lens}>
			<div className="lens" aria-labelledby="lens-title">
				<div className="lens-heading">
					<h3 id="lens-title">Review for</h3>
					<p aria-live="polite">{activeLens?.description}</p>
				</div>
				<div className="lens-options">
					{evidenceLenses.map((option) => (
						<button
							key={option.id}
							type="button"
							aria-pressed={lens === option.id}
							onClick={() => changeLens(option.id)}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>

			<ol className="evidence-list">
				{orderedItems.map((item) => (
					<li
						key={item.id}
						ref={(element) => {
							if (element) itemElements.current.set(item.id, element);
							else itemElements.current.delete(item.id);
						}}
						className={item.relevantFor.includes(lens) ? "is-relevant" : undefined}
					>
						<details name="evidence">
							<summary>
								<span className="evidence-kind">{item.kind}</span>
								<span className="evidence-title">
									<strong>{item.title}</strong>
									<span>{item.source}</span>
								</span>
								<span className="evidence-signal">{item.signal}</span>
								<span className="evidence-toggle" aria-hidden="true" />
							</summary>
							<div className="evidence-detail">
								<div>
									<p className="evidence-summary">{item.summary}</p>
									{item.details.length > 0 ? (
										<ul>
											{item.details.map((detail) => (
												<li key={detail}>{detail}</li>
											))}
										</ul>
									) : null}
								</div>
								<dl className="evidence-meta">
									<div>
										<dt>Period</dt>
										<dd>{item.period}</dd>
									</div>
									<div>
										<dt>Relevant to</dt>
										<dd>{item.relevantFor.map(lensLabel).join(", ")}</dd>
									</div>
									{item.technologies?.length ? (
										<div>
											<dt>Built with</dt>
											<dd>{item.technologies.join(", ")}</dd>
										</div>
									) : null}
								</dl>
								{item.links?.length ? (
									<div className="evidence-links">
										{item.links.map((link) => (
											<a key={link.label} href={link.href} target="_blank" rel="noreferrer">
												{link.label}
												<span className="sr-only"> (opens in a new tab)</span>
											</a>
										))}
									</div>
								) : null}
							</div>
						</details>
					</li>
				))}
			</ol>
		</div>
	);
}

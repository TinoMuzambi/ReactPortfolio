"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type Palette = {
	readonly paper: string;
	readonly ink: string;
	readonly rule: string;
	readonly primary: string;
	readonly secondary: string;
	readonly surface: string;
};

const storageKey = "tinomuzambi-palette-v2";

const defaultPalette: Palette = {
	paper: "#f8fbf7",
	ink: "#142018",
	rule: "#9baaa0",
	primary: "#236b4a",
	secondary: "#c77d13",
	surface: "#e5eee7",
};

const originalPalette: Palette = {
	paper: "#ffffff",
	ink: "#000000",
	rule: "#000000",
	primary: "#6437b6",
	secondary: "#58cdb7",
	surface: "#e8ebee",
};

const presets = [
	{ id: "pine", name: "Pine", colors: defaultPalette },
	{ id: "original", name: "Original", colors: originalPalette },
	{
		id: "cobalt",
		name: "Cobalt",
		colors: {
			paper: "#f7f9fc",
			ink: "#172033",
			rule: "#91a0b6",
			primary: "#315acb",
			secondary: "#20a39e",
			surface: "#e6ebf3",
		},
	},
	{
		id: "burgundy",
		name: "Burgundy",
		colors: {
			paper: "#fffafa",
			ink: "#27191f",
			rule: "#bdaeb4",
			primary: "#8b2942",
			secondary: "#398da8",
			surface: "#f1e6ea",
		},
	},
	{
		id: "night",
		name: "Night",
		colors: {
			paper: "#0d1117",
			ink: "#e8eef5",
			rule: "#536174",
			primary: "#a88bff",
			secondary: "#55d6be",
			surface: "#18202b",
		},
	},
] as const;

const fields = [
	{ key: "paper", label: "Background" },
	{ key: "ink", label: "Text" },
	{ key: "rule", label: "Rules" },
	{ key: "primary", label: "Primary accent" },
	{ key: "secondary", label: "Secondary accent" },
	{ key: "surface", label: "Muted surface" },
] as const;

const variables: Record<keyof Palette, string> = {
	paper: "--color-paper",
	ink: "--color-ink",
	rule: "--color-rule",
	primary: "--color-plum",
	secondary: "--color-aqua",
	surface: "--color-interface",
};

function isPalette(value: unknown): value is Palette {
	if (!value || typeof value !== "object") return false;

	return fields.every(({ key }) => {
		const color = (value as Record<string, unknown>)[key];
		return typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color);
	});
}

function paletteName(colors: Palette) {
	return presets.find((preset) =>
		fields.every(({ key }) => preset.colors[key] === colors[key])
	)?.id ?? "custom";
}

function isDark(color: string) {
	const red = Number.parseInt(color.slice(1, 3), 16);
	const green = Number.parseInt(color.slice(3, 5), 16);
	const blue = Number.parseInt(color.slice(5, 7), 16);
	return (red * 299 + green * 587 + blue * 114) / 255000 < 0.45;
}

function applyPalette(colors: Palette) {
	const root = document.documentElement;

	for (const { key } of fields) {
		root.style.setProperty(variables[key], colors[key]);
	}

	const mode = isDark(colors.paper) ? "dark" : "light";
	root.style.colorScheme = mode;
	root.dataset.paletteMode = mode;
	document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors.paper);
}

export function PaletteStudio() {
	const [isOpen, setIsOpen] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [colors, setColors] = useState<Palette>(defaultPalette);

	useEffect(() => {
		let initialPalette = defaultPalette;

		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				const parsed: unknown = JSON.parse(saved);
				if (isPalette(parsed)) {
					initialPalette = parsed;
					applyPalette(parsed);
				}
			}
		} catch {
			initialPalette = defaultPalette;
		}

		const frame = requestAnimationFrame(() => {
			setColors(initialPalette);
			setHasLoaded(true);
		});

		return () => cancelAnimationFrame(frame);
	}, []);

	useEffect(() => {
		if (!hasLoaded) return;
		applyPalette(colors);
		localStorage.setItem(storageKey, JSON.stringify(colors));
	}, [colors, hasLoaded]);

	useEffect(() => {
		if (!isOpen) return;

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [isOpen]);

	const activePalette = paletteName(colors);

	return (
		<>
			<button
				className="palette-trigger"
				type="button"
				aria-expanded={isOpen}
				aria-controls="palette-studio"
				onClick={() => setIsOpen((value) => !value)}
			>
				<span className="palette-trigger-swatches" aria-hidden="true">
					<span style={{ backgroundColor: colors.primary }} />
					<span style={{ backgroundColor: colors.secondary }} />
					<span style={{ backgroundColor: colors.ink }} />
				</span>
				Colours
			</button>

			{isOpen ? (
				<aside className="palette-studio" id="palette-studio" aria-labelledby="palette-title">
					<header>
						<div>
							<h2 id="palette-title">Colour palette</h2>
							<p>Try a preset or tune each role.</p>
						</div>
						<button type="button" onClick={() => setIsOpen(false)} aria-label="Close colour palette">
							Close
						</button>
					</header>

					<div className="palette-presets" aria-label="Palette presets">
						{presets.map((preset) => (
							<button
								className={activePalette === preset.id ? "is-active" : undefined}
								type="button"
								key={preset.id}
								onClick={() => setColors(preset.colors)}
							>
								<span className="preset-swatches" aria-hidden="true">
									{[preset.colors.paper, preset.colors.ink, preset.colors.primary, preset.colors.secondary].map((color) => (
										<span key={color} style={{ backgroundColor: color } as CSSProperties} />
									))}
								</span>
								<span>{preset.name}</span>
							</button>
						))}
					</div>

					<fieldset className="palette-fields">
						<legend>Individual colours</legend>
						{fields.map((field) => (
							<label key={field.key}>
								<span>{field.label}</span>
								<input
									type="color"
									value={colors[field.key]}
									onChange={(event) => setColors((current) => ({ ...current, [field.key]: event.target.value }))}
								/>
								<output>{colors[field.key].toUpperCase()}</output>
							</label>
						))}
					</fieldset>

					<footer>
						<p>Changes save in this browser.</p>
						<button type="button" onClick={() => setColors(defaultPalette)}>Reset</button>
					</footer>
				</aside>
			) : null}
		</>
	);
}

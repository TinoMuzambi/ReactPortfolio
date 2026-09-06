import { portfolio } from "@/content/portfolio";
import type { CaseStudy } from "@/types/case-study";

export const caseStudies: readonly CaseStudy[] = [
	{
		slug: "music-rec-path-signatures",
		projectId: "music-rec-path-signatures",
		statement: "Make recommendation research repeatable before making it persuasive.",
		problem:
			"Evaluate music-recommendation approaches with a pipeline that accounts for ranking quality and diversity, while keeping incomplete runs from being mistaken for valid evidence.",
		traces: [
			{
				constraint: "Research comparisons need to be reproducible.",
				decision: "Implement the evaluation as a repeatable Python pipeline.",
				evidence: "The public repository documents a reproducible evaluation workflow.",
			},
			{
				constraint: "The evaluation scope includes ranking and diversity.",
				decision: "Keep ranking metrics and diversity metrics in the same evaluation process.",
				evidence: "Both metric families are represented in the repository's evaluation outputs.",
			},
			{
				constraint: "A partial pipeline can produce results that look complete.",
				decision: "Fail closed when required inputs or validation steps are missing.",
				evidence: "Automated tests exercise the validation and failure paths.",
			},
		],
		evidence: [
			"Python source and test suite are public.",
			"The pipeline evaluates path-signature recommendation research.",
			"Ranking and diversity metrics are both part of the evaluation record.",
		],
		unknowns: [
			"No production serving latency or infrastructure is published.",
			"No user-adoption or business-impact metric is claimed.",
			"Dataset redistribution terms are not summarised on this portfolio.",
		],
		links: [
			{
				label: "Inspect the repository",
				href: "https://github.com/TinoMuzambi/MusicRecPathSignatures",
			},
		],
	},
	{
		slug: "advice",
		projectId: "advice",
		statement: "Turn scattered curriculum rules into one place students can act from.",
		problem:
			"UCT students and advisors repeatedly navigate curriculum information distributed across university sources. Advice brings course summaries, credit calculation and common questions into one platform.",
		traces: [
			{
				constraint: "Curriculum information was spread across several sources.",
				decision: "Collate course and major information in a single student-facing platform.",
				evidence: "The live project groups course summaries and advising information together.",
			},
			{
				constraint: "Students needed to understand progress toward degree requirements.",
				decision: "Include a credit calculator alongside the reference material.",
				evidence: "Credit calculation is part of the documented product scope.",
			},
			{
				constraint: "Advisors received recurring basic questions.",
				decision: "Provide a chatbot for common UCT-specific questions.",
				evidence: "The portfolio record and project documentation both identify the chatbot.",
			},
		],
		evidence: [
			"Next.js, React and TypeScript power the application.",
			"MongoDB stores application data and NextAuth.js handles authentication.",
			"Cypress is listed in the project's test stack.",
		],
		unknowns: [
			"No verified adoption or task-completion metric is published.",
			"The portfolio does not state the current maintenance owner.",
			"No accessibility audit result is published.",
		],
		links: [
			{ label: "Open the project", href: "https://advice-uct.vercel.app/" },
			{ label: "Read the documentation", href: "https://advice-docs.netlify.app/" },
		],
	},
	{
		slug: "clock-in-out",
		projectId: "clock-in-out",
		statement: "Use one personal dataset to practise the complete analysis loop.",
		problem:
			"Understand patterns in office clock-in and clock-out times while postgraduate lectures and other commitments changed the usual working schedule.",
		traces: [
			{
				constraint: "The learning goal covered every stage of data analysis.",
				decision: "Carry one dataset from collection and cleaning through visualisation and narrative.",
				evidence: "The published notebook documents the end-to-end analysis.",
			},
			{
				constraint: "The result needed to be inspectable as analysis and as a readable story.",
				decision: "Publish the work as a Quarto document using R.",
				evidence: "The repository and rendered project expose the notebook and its output.",
			},
			{
				constraint: "Static summaries and exploratory views answer different questions.",
				decision: "Use ggplot2 and Plotly in the visualisation layer.",
				evidence: "Both tools are present in the canonical project stack.",
			},
		],
		evidence: [
			"The rendered analysis is publicly accessible through GitHub Pages.",
			"Source, notebook and chart output are available in the public repository.",
			"The dataset is personal office clock-in and clock-out data.",
		],
		unknowns: [
			"The portfolio does not publish a validated causal interpretation.",
			"Sample size and collection interval are not summarised here.",
			"The analysis is personal and does not claim population-level generalisability.",
		],
		links: [
			{
				label: "Read the analysis",
				href: "https://tinomuzambi.github.io/ClockInOut/",
			},
			{
				label: "Inspect the repository",
				href: "https://github.com/TinoMuzambi/ClockInOut",
			},
		],
	},
	{
		slug: "recomments",
		projectId: "recomments",
		statement: "Restore a discussion layer without pretending to own the video layer.",
		problem:
			"Give viewers a place to discuss YouTube videos when comments are disabled, while retaining enough video context for the conversation to make sense.",
		traces: [
			{
				constraint: "The source video and its metadata still belong to YouTube.",
				decision: "Retrieve video details through YouTube APIs and keep the player embedded.",
				evidence: "The project exposes a YouTube-like video view with an embedded player.",
			},
			{
				constraint: "Discussion requires persistent identity and thread state.",
				decision: "Use Google sign-in and persist comments, replies and reactions in MongoDB.",
				evidence: "Authentication and comment operations are documented project capabilities.",
			},
			{
				constraint: "People may not revisit a separate discussion thread.",
				decision: "Notify participants by email when someone replies, with an unsubscribe path.",
				evidence: "Reply notifications and subscription controls are in the published feature record.",
			},
		],
		evidence: [
			"The application is a full-stack TypeScript and Next.js project.",
			"MongoDB stores user and comment data.",
			"The public source repository documents the product flow.",
		],
		unknowns: [
			"No verified active-user or comment-volume metric is published.",
			"Current Google or YouTube API review status is not stated.",
			"The live link is retained from the canonical record; uptime is not guaranteed here.",
		],
		links: [
			{ label: "Open the project", href: "https://recomments.tinomuzambi.com" },
			{
				label: "Inspect the repository",
				href: "https://github.com/TinoMuzambi/ReComments",
			},
		],
	},
];

export const getCaseStudy = (slug: string) =>
	caseStudies.find((caseStudy) => caseStudy.slug === slug);

export const getCaseStudyProject = (caseStudy: CaseStudy) => {
	const project = portfolio.projects.find(
		(candidate) => candidate.id === caseStudy.projectId
	);

	if (!project) {
		throw new Error(`Missing canonical project for case study: ${caseStudy.slug}`);
	}

	return project;
};

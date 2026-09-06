import type { PortfolioContent } from "@/types/content";

export const portfolio: PortfolioContent = {
	profile: {
		name: "Tino Muzambi",
		role: "Full-Stack Web Developer",
		headline:
			"Full-stack developer in Cape Town, working where product engineering and applied data meet.",
		summary:
			"I'm Tino, a full-stack developer based in Cape Town, South Africa. I build responsive web and mobile products, connect the systems behind them, and use data to ask better questions about how software behaves. I completed an MSc in Data Science at the University of Cape Town in 2026.",
		location: "Cape Town, South Africa",
		email: "tino@tinomuzambi.com",
		website: "https://tinomuzambi.com",
		links: [
			{ label: "GitHub", href: "https://github.com/TinoMuzambi" },
			{ label: "LinkedIn", href: "https://linkedin.com/in/tinomuzambi" },
			{ label: "Project archive", href: "https://projects.tinomuzambi.com" },
			{ label: "Blog", href: "https://blog.tinomuzambi.com" },
		],
	},
	experience: [
		{
			id: "ovex-intermediate-developer",
			role: "Intermediate Developer",
			organisation: "OVEX",
			period: "May 2025 – present",
			highlights: [
				"Develop and maintain responsive web and mobile applications using Next.js and React Native.",
				"Build and integrate GraphQL endpoints, ensuring seamless data flow and system interoperability.",
				"Collaborate with designers and back-end developers to implement polished, user-centric interfaces.",
				"Optimise performance and accessibility across devices and browsers while maintaining reusable component libraries.",
				"Write clean, efficient and well-tested code aligned with modern development practices.",
			],
		},
		{
			id: "uct-web-developer",
			role: "Web Developer",
			organisation: "University of Cape Town",
			period: "February 2023 – May 2025",
			highlights: [
				"Architected and deployed the DS-I Africa website using Drupal.",
				"Developed project-specific websites with Next.js, React and vanilla JavaScript.",
				"Implemented automated REDCap workflows to reduce survey input time and improve processes.",
				"Co-spearheaded the DS-I Africa Data Management Working Group, establishing data standards for more than 38 research projects.",
				"Automated mailing-list management with Python scripts and implemented proactive monitoring.",
			],
		},
		{
			id: "four-minute-medicine-full-stack-developer",
			role: "Full-Stack Web Developer",
			organisation: "Four Minute Medicine",
			period: "June 2022 – October 2022",
			highlights: [
				"Built an educational platform with Next.js and TypeScript under the guidance of a senior full-stack developer.",
				"Implemented an AWS serverless architecture with Amplify, AppSync, Lambda and DynamoDB.",
				"Developed AppSync GraphQL APIs for medical content, progress tracking and assessments.",
				"Integrated authentication with Amazon Cognito.",
			],
		},
		{
			id: "123tutors-frontend-developer",
			role: "Front-end Developer",
			organisation: "123tutors",
			period: "April 2022 – January 2023",
			highlights: [
				"Engineered a Paystack payment-gateway integration.",
				"Developed a component library using Next.js, TypeScript and Tailwind CSS.",
				"Designed dashboards for students, tutors and administrators.",
				"Collaborated with a back-end engineer on front-end and back-end integration.",
			],
		},
		{
			id: "vodacom-solutions-management-intern",
			role: "Solutions Management Intern",
			organisation: "Vodacom",
			period: "February 2022 – February 2023",
			highlights: [
				"Conducted more than 1,000 site-feasibility assessments using Afrigis.",
				"Co-facilitated the AWS re/Start programme for more than 50 students.",
				"Automated parts of the solution-quotation process with Excel macros and Siebel/Ignite integrations.",
				"Completed the Programme in Enterprise and Technology Management.",
			],
		},
		{
			id: "uct-adp-web-developer",
			role: "Web Developer",
			organisation: "Department of Academic Development Programme, University of Cape Town",
			period: "December 2021 – December 2023",
			highlights: [
				"Led development of a student-support system that extended an Honours project.",
				"Architected a personalised Next.js dashboard serving more than 5,000 Commerce students.",
				"Integrated the UCT Cares chatbot and developed a handbook-integration API.",
			],
		},
		{
			id: "varsity-newspaper-lead-developer",
			role: "Lead Developer",
			organisation: "Varsity Newspaper, University of Cape Town",
			period: "August 2021 – May 2022",
			highlights: [
				"Led the migration of a legacy news website to Next.js.",
				"Led a team of five developers and mentored three junior developers.",
				"Executed the handover to the subsequent team.",
			],
		},
		{
			id: "elle-zeka-full-stack-developer",
			role: "Full-Stack Web Developer",
			organisation: "Elle Zeka",
			period: "August 2020 – January 2022",
			highlights: [
				"Delivered more than 15 custom web solutions for business clients.",
				"Implemented responsive designs and managed hosting infrastructure for multiple clients.",
			],
		},
		{
			id: "uct-spsc-chairperson",
			role: "Chairperson, Science Postgraduate Students' Council",
			organisation: "University of Cape Town",
			period: "November 2020 – March 2022",
			highlights: [
				"Led the executive and represented postgraduate students in meetings with university leadership.",
			],
		},
		{
			id: "uct-ssc-it-resource-manager",
			role: "IT & Resource Manager, Science Students' Council",
			organisation: "University of Cape Town",
			period: "September 2019 – November 2020",
			highlights: [
				"Managed the council's online platforms and handled IT matters concerning undergraduate computer labs.",
			],
		},
		{
			id: "uct-computer-science-tutor",
			role: "Computer Science Tutor",
			organisation: "University of Cape Town",
			period: "January 2019 – January 2021",
			highlights: [
				"Ran practical and theory sessions and marked assessments for first- and second-year Computer Science courses, primarily in Python and Java.",
			],
		},
		{
			id: "electrum-software-developer-intern",
			role: "Software Developer Intern",
			organisation: "Electrum Payments",
			period: "June 2019 – July 2019",
			highlights: [
				"Worked on a production project implemented by Capitec Bank using Java, XML and AWS.",
			],
		},
	],
	education: [
		{
			id: "uct-msc-data-science",
			qualification: "MSc Data Science",
			institution: "University of Cape Town",
			period: "2024 – 2026",
			details: [
				"Completed in 2026 with a distinction in the coursework component. Graduation is scheduled for March 2027.",
				"Coursework included data visualisation, exploratory data analysis, supervised and unsupervised learning, simulation and optimisation, data science for industry, and machine learning.",
				"Dissertation: fair and explainable music recommendation systems using path signatures and transformer architectures, with a focus on reducing algorithmic bias in content delivery.",
			],
		},
		{
			id: "uct-bsc-hons-computer-science",
			qualification: "BSc Hons Computer Science",
			institution: "University of Cape Town",
			period: "2021 – 2022",
			details: [
				"Coursework included artificial intelligence, big data, analytics, compilers, functional programming, machine learning, network security, human-computer interaction, research and innovation.",
				"Honours project: co-developed a virtual student-advisor platform with a personalised dashboard, chatbot and UCT handbook integration.",
			],
		},
		{
			id: "uct-bsc-computer-science",
			qualification: "BSc Computer Science",
			institution: "University of Cape Town",
			period: "2018 – 2020",
			details: [
				"Coursework covered algorithms, data structures, databases, concurrent programming, networks, operating systems, software design, C++, Java, Python, mathematics and statistics.",
				"Capstone: co-developed a searchable catalogue for rating Python learning resources.",
				"Golden Key International Honour Society chapter award. Dean's Merit List in 2018 and 2020.",
			],
		},
		{
			id: "fields-college-nsc",
			qualification: "National Senior Certificate",
			institution: "Fields College",
			period: "2013 – 2017",
			details: [
				"Studied Mathematics, Advanced Programme Mathematics, Physical Sciences, Information Technology and Accounting.",
				"Four distinctions. Highest achievement in Information Technology in 2017. Top-ten achiever from 2013 to 2017.",
			],
		},
	],
	projects: [
		{
			id: "music-rec-path-signatures",
			name: "MusicRecPathSignatures",
			summary:
				"A reproducible Python evaluation pipeline for music-recommendation research using path signatures, ranking metrics and diversity metrics. Its tested pipeline fails closed when required inputs or validation steps are missing.",
			technologies: [
				"Python",
				"Path signatures",
				"Recommendation systems",
				"Evaluation pipelines",
			],
			featured: true,
			sourceUrl: "https://github.com/TinoMuzambi/MusicRecPathSignatures",
		},
		{
			id: "clock-in-out",
			name: "Clock In/Out Analysis",
			summary:
				"An end-to-end data-analysis project covering collection, cleaning, visualisation and storytelling with personal office clock-in data.",
			technologies: ["R", "Quarto", "ggplot2", "Plotly", "GitHub Pages"],
			featured: true,
			liveUrl: "https://tinomuzambi.github.io/ClockInOut/",
			sourceUrl: "https://github.com/TinoMuzambi/ClockInOut",
		},
		{
			id: "trainerr",
			name: "Trainerr",
			summary:
				"A Flutter app for viewing Cape Town train schedules, backed by a Next.js API that scrapes timetable data and stores it in MongoDB.",
			technologies: [
				"Flutter",
				"Dart",
				"Next.js",
				"TypeScript",
				"MongoDB",
				"Puppeteer",
			],
			featured: true,
			sourceUrl: "https://github.com/TinoMuzambi/trainerr",
		},
		{
			id: "advice",
			name: "Advice",
			summary:
				"A student-advising platform that collates UCT curriculum information, calculates credits and answers common questions through a chatbot.",
			technologies: [
				"Next.js",
				"TypeScript",
				"React",
				"MongoDB",
				"NextAuth.js",
				"Cypress",
			],
			featured: true,
			liveUrl: "https://advice-uct.vercel.app/",
			referenceUrl: "https://advice-docs.netlify.app/",
		},
		{
			id: "landon-hotel",
			name: "Landon Hotel",
			summary:
				"A course project demonstrating a serverless React application across AWS Amplify, Lambda, DynamoDB and API Gateway.",
			technologies: [
				"React",
				"Node.js",
				"AWS Amplify",
				"Lambda",
				"DynamoDB",
				"API Gateway",
			],
			featured: true,
			sourceUrl: "https://github.com/TinoMuzambi/ReactServerlessAWS",
		},
		{
			id: "colour-schemes",
			name: "Colour Schemes",
			summary:
				"A TypeScript React Native colour-scheme generator powered by The Color API.",
			technologies: ["React Native", "Expo", "TypeScript", "Android", "iOS"],
			featured: false,
			liveUrl: "https://expo.dev/accounts/tinomuzambi/projects/ColourSchemes",
			sourceUrl: "https://github.com/TinoMuzambi/RNColourScheme",
		},
		{
			id: "tailwind-expo",
			name: "Tailwind Expo",
			summary:
				"A responsive Next.js and TypeScript landing page built as a first exploration of Tailwind CSS.",
			technologies: ["Tailwind CSS", "Next.js", "TypeScript", "React"],
			featured: true,
			liveUrl: "https://tailwind-expo.vercel.app",
			sourceUrl: "https://github.com/TinoMuzambi/TailwindExpo",
		},
		{
			id: "paystack",
			name: "Paystack",
			summary:
				"A Next.js payment playground that initialises Paystack payments and verifies transactions in a serverless function.",
			technologies: ["TypeScript", "Next.js", "Paystack", "React", "Vercel"],
			featured: false,
			liveUrl: "https://paystack-blue.vercel.app/",
			sourceUrl: "https://github.com/TinoMuzambi/Paystack",
		},
		{
			id: "recomments",
			name: "ReComments",
			summary:
				"A full-stack commenting service for YouTube videos whose native comments are disabled, with Google sign-in, nested replies and email notifications.",
			technologies: [
				"TypeScript",
				"React",
				"Next.js",
				"MongoDB",
				"YouTube API",
				"Google APIs",
			],
			featured: true,
			liveUrl: "https://recomments.tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/ReComments",
		},
		{
			id: "marvel-characters",
			name: "Marvel Characters",
			summary:
				"A React interface for browsing, searching and sorting characters from the Marvel API.",
			technologies: ["React", "JavaScript", "Marvel API"],
			featured: false,
			liveUrl: "https://marvel-characters-sepia.vercel.app/",
			sourceUrl: "https://github.com/TinoMuzambi/MarvelCharacters",
		},
		{
			id: "clash-ratios",
			name: "Clash Ratios",
			summary:
				"A TypeScript app that compares two Clash of Clans players' donation ratios through the game's API.",
			technologies: ["TypeScript", "Next.js", "React", "Node.js", "Express"],
			featured: false,
			liveUrl: "https://clashratios.tinomuzambi.com/",
			sourceUrl: "https://github.com/TinoMuzambi/ClashRatios",
		},
		{
			id: "ml-video-annotations",
			name: "ML Video Annotations",
			summary:
				"A browser experiment that classifies hand and facial gestures, then maps each category to a visual overlay.",
			technologies: ["Machine learning", "ml5.js", "p5.js", "JavaScript"],
			featured: true,
			sourceUrl: "https://github.com/TinoMuzambi/MLVideoAnnotations",
		},
		{
			id: "tweet-streams",
			name: "Tweet Streams",
			summary:
				"A React app that streams tweets in real time for a supplied search query.",
			technologies: ["React", "Express", "Socket.IO", "Twitter API", "Node.js"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/TweetStreams",
		},
		{
			id: "next-blog",
			name: "Next Blog",
			summary: "A server-rendered Next.js port of Blog.TinoMuzambi.",
			technologies: ["Next.js", "React", "JavaScript"],
			featured: false,
			liveUrl: "https://next-blog-tinomuzambi.vercel.app/",
			sourceUrl: "https://github.com/TinoMuzambi/NextBlog",
		},
		{
			id: "cubing-algos",
			name: "Cubing Algos",
			summary: "A compact reference for 2-look OLL and PLL Rubik's Cube algorithms.",
			technologies: ["HTML", "CSS", "JavaScript", "Firebase", "Firestore"],
			featured: true,
			liveUrl: "https://cubingalgos.netlify.app",
			sourceUrl: "https://github.com/TinoMuzambi/CubingAlgos",
		},
		{
			id: "tinomuzambi-com",
			name: "TinoMuzambi.com",
			summary:
				"A personal site and online CV covering technical skills, work experience, education and project work.",
			technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
			featured: true,
			liveUrl: "https://tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/ReactPortfolio",
		},
		{
			id: "working-with-clash",
			name: "Working With Clash",
			summary:
				"A full-stack React app for retrieving Clash of Clans player and clan information by tag.",
			technologies: ["React", "JavaScript", "Node.js", "Express", "Clash of Clans API"],
			featured: true,
			liveUrl: "https://wwc.tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/WorkingWithClash",
		},
		{
			id: "table-time",
			name: "Table Time",
			summary:
				"A progressive web app for scoring table-tennis matches and persisting match history.",
			technologies: ["React", "Node.js", "Express", "MongoDB", "Pusher"],
			featured: true,
			liveUrl: "https://table.tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/TableTime",
		},
		{
			id: "projects-tinomuzambi",
			name: "Projects.TinoMuzambi",
			summary:
				"A searchable Next.js catalogue of personal projects, their technology stacks and live links.",
			technologies: ["Next.js", "React", "JavaScript"],
			featured: true,
			liveUrl: "https://projects.tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/Projects.TinoMuzambi",
		},
		{
			id: "whatsapp-chat-analyser",
			name: "WhatsApp Chat Analyser",
			summary:
				"A Python app that parses exported WhatsApp chats and derives statistics and insights through string processing.",
			technologies: ["Python", "Flask", "HTML", "CSS"],
			featured: true,
			sourceUrl: "https://github.com/TinoMuzambi/WhatsAppAnalyser",
		},
		{
			id: "remove-contractions",
			name: "Remove Contractions",
			summary:
				"A Python web utility that expands contractions in a supplied body of text.",
			technologies: ["Python", "Flask", "HTML", "CSS"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/RemoveContractions",
		},
		{
			id: "amount-divider",
			name: "Amount Divider",
			summary:
				"A Python utility that divides an amount into a configurable number of uneven partitions.",
			technologies: ["Python", "Flask", "HTML", "CSS"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/AmountDivider",
		},
		{
			id: "blog-tinomuzambi",
			name: "Blog.TinoMuzambi",
			summary: "A React-based personal blog with Firebase and Firestore integrations.",
			technologies: ["React", "JavaScript", "Firebase", "Firestore"],
			featured: true,
			liveUrl: "https://blog.tinomuzambi.com",
			sourceUrl: "https://github.com/TinoMuzambi/ReactBlog",
		},
		{
			id: "twibot",
			name: "TwiBot",
			summary: "A Python bot built as an early experiment with the Twitter API.",
			technologies: ["Python", "Twitter API"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/TwiBot",
		},
		{
			id: "go-conversion-tool",
			name: "Go Conversion Tool",
			summary: "A Go command-line tool for common bidirectional conversions.",
			technologies: ["Go"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/GoConversionTool",
		},
		{
			id: "automate-mail",
			name: "Automate Mail",
			summary: "A configurable Python script that sends email at regular intervals.",
			technologies: ["Python", "smtplib"],
			featured: false,
			sourceUrl: "https://github.com/TinoMuzambi/AutomateMail",
		},
	],
	skillGroups: [
		{
			label: "Languages",
			items: ["TypeScript", "JavaScript", "Python", "Java", "Go", "C", "C++", "C#"],
		},
		{
			label: "Web application development",
			items: [
				"React",
				"Next.js",
				"Node.js",
				"Tailwind CSS",
				"HTML",
				"CSS",
				"Flask",
				"MongoDB",
			],
		},
		{
			label: "Cloud, data and systems",
			items: [
				"AWS",
				"Azure",
				"Firebase",
				"Machine learning",
				"Data visualisation",
				"Linux",
				"Home server administration",
				"Networking",
				"Backups",
				"Monitoring",
			],
		},
		{
			label: "Delivery and AI tools",
			items: [
				"Git",
				"GitHub",
				"Vercel",
				"Netlify",
				"Claude Code",
				"Codex",
				"AI-assisted software delivery",
				"Code review",
			],
		},
	],
};

export const featuredProjects = portfolio.projects.filter(
	(project) => project.featured
);

const selectedProjectIds = [
	"music-rec-path-signatures",
	"advice",
	"clock-in-out",
	"recomments",
] as const;

export const selectedProjects = selectedProjectIds.map((id) => {
	const project = portfolio.projects.find((candidate) => candidate.id === id);
	if (!project) throw new Error(`Missing selected project: ${id}`);
	return project;
});

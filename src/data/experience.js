import SSC from "./ssc.png";
import SPSC from "./spsc.png";
import ElleZeka from "./elle.png";
import Electrum from "./electrum.png";
import UCT from "./uct.gif";

const experience = [
	{
		title: "Chairperson of the Science Postgraduate Students' Council",
		institution: "Univesity of Cape Town",
		period: "November 2020 - current",
		description: `The role of the chairperson amonst others is to lead as well as guide the
		other executive members in the execution of their duties as well as to be
		the voice of the postgraduate students in meetings with University
		executive.`,
		icon: <img src={SPSC} alt="spsc" />,
	},
	{
		title: "Full Stack Web Developer",
		institution: "Elle Zeka",
		period: "August 2020 - current",
		description: `I work on implementing front-end website solutions for business clients
			as well as full-stack website solutions for business clients. This post
			involves web designs, web hosting as well as the implementation of the
			websites.`,
		icon: <img src={ElleZeka} alt="elle zeka" />,
	},
	{
		title: "IT & Resource Manager of the Science Students' Council",
		institution: "University of Cape Town",
		period: "September 2019 - November 2020",
		description: `The IT & Resource Manager:
			-Manages all online platforms of the SSC.
			-Ensures that all IT related media is up to date.
			-Attends to any grievances from students with regards to the science
			undergraduate computer labs.
			-Responsible for research and analysing information for
			recommendation to the relevant portfolio holders within the SSC.`,
		icon: <img src={SSC} alt="ssc" />,
	},
	{
		title: "Computer Science Tutor",
		institution: "University of Cape Town",
		period: "January 2019 - November 2020",
		description: `This job included the following for first & second year Computer Science
			courses primarily in Python & Java:
			-Conducting practical programming sessions.
			-Conducting theoretical problem solving sessions.
			-Invigilating and marking tests.`,
		icon: <img src={UCT} alt="uct" />,
	},
	{
		title: "Software Developer Intern",
		institution: "Electrum Payments",
		period: "June 2019 - July 2019",
		description: `I worked on a real life project that was implemented by Capitec Bank.
		Technologies used include Java, XML and AWS.`,
		icon: <img src={Electrum} alt="electrum" />,
	},
];

export default experience;

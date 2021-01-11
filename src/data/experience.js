import SSC from "./ssc.png";
import SPSC from "./spsc.png";
import ElleZeka from "./elle.png";
import Electrum from "./electrum.png";
import UCT from "./uct.png";

const experience = [
	{
		title: "Chairperson of the Science Postgraduate Students' Council",
		institution: "Univesity of Cape Town",
		period: "November 2020 - current",
		description: `The role of the chairperson is to lead as well as guide the
		other executive members in the execution of their duties as well as to be
		the voice of the postgraduate students in meetings with University
		executive.`,
		icon: <img src={SPSC} alt="spsc" className="timeline-image" />,
	},
	{
		title: "Full Stack Web Developer",
		institution: "Elle Zeka",
		period: "August 2020 - current",
		description: `I work on implementing front-end as well as full-stack website solutions for business clients. 
			This post involves web designs, web hosting as well as the implementation of the
			websites.`,
		icon: <img src={ElleZeka} alt="elle zeka" className="timeline-image" />,
	},
	{
		title: "IT & Resource Manager of the Science Students' Council",
		institution: "University of Cape Town",
		period: "September 2019 - November 2020",
		description: `The IT & Resource Manager is responsible for managing all online platforms of the SSC, ensuring all the IT related media is current as well as attending any grievances with regards to 
			science undergraduate computer labs.
			`,
		icon: <img src={SSC} alt="ssc" className="timeline-image" />,
	},
	{
		title: "Computer Science Tutor",
		institution: "University of Cape Town",
		period: "January 2019 - November 2020",
		description: `This job included conducting practical and theoretical programming sessions as well as invigilating and marking tests
			for first & second year Computer Science
			courses primarily in Python & Java.
			`,
		icon: <img src={UCT} alt="uct" className="timeline-image" />,
	},
	{
		title: "Software Developer Intern",
		institution: "Electrum Payments",
		period: "June 2019 - July 2019",
		description: `I worked on a real life project that was implemented by Capitec Bank.
		Technologies used include Java, XML and AWS.`,
		icon: <img src={Electrum} alt="electrum" className="timeline-image" />,
	},
];

export default experience;

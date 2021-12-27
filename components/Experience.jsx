import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";

import { opacity } from "../data/variants";

const Experience = ({ experience }) => {
	return (
		<div className="experience">
			<motion.h1
				className="title"
				initial="start"
				animate="end"
				variants={opacity}
			>
				Experience
			</motion.h1>

			<VerticalTimeline className="timeline">
				{experience.map((item, key) => (
					<VerticalTimelineElement
						key={key}
						className="vertical-timeline-element--work"
						contentStyle={{
							background: " rgba(55, 237, 83, 0.4)",
							color: "#fff",
							marginTop: "2rem",
							width: "42%",
						}}
						date={item.period}
						iconStyle={{
							background: "#0ce3f2aa",
							marginTop: "1rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						icon={<img src={item.icon} alt="experience item" />}
						iconClassName="round"
						visible={true}
					>
						<h3 className="vertical-timeline-element-title">{item.title}</h3>
						<h4 className="vertical-timeline-element-subtitle">
							{item.institution}
						</h4>
						<h5 className="vertical-timeline-element-subtitle date">
							{item.period}
						</h5>
						<p>{item.description}</p>
					</VerticalTimelineElement>
				))}
			</VerticalTimeline>
		</div>
	);
};

export default Experience;

import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaUniversity } from "react-icons/fa";
// import education from "../data/education";
import { motion } from "framer-motion";
import { opacity } from "../data/variants";

const Education = ({ education }) => {
	return (
		<div className="education">
			<motion.h1
				className="title"
				initial="start"
				animate="end"
				variants={opacity}
			>
				Education
			</motion.h1>

			<VerticalTimeline className="timeline">
				{education.map((item, key) => (
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
							background: "#0ce3f2",
							color: "#fff",
							marginTop: "1rem",
						}}
						iconClassName="round"
						icon={<FaUniversity />}
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

export default Education;

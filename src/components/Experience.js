import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
// import { FaBuilding } from "react-icons/fa";
import experience from "../data/experience";

const Experience = () => {
	return (
		<div className="experience">
			<h1 className="title">Experience</h1>

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
							background: "#0cf277",
							color: "#fff",
							marginTop: "1rem",
						}}
						icon={item.icon}
						visible={true}
					>
						<h3 className="vertical-timeline-element-title">{item.title}</h3>
						<h4 className="vertical-timeline-element-subtitle">
							{item.institution}
						</h4>
						<h4 className="vertical-timeline-element-subtitle">
							{item.period}
						</h4>
						<p>{item.description}</p>
					</VerticalTimelineElement>
				))}
			</VerticalTimeline>
		</div>
	);
};

export default Experience;

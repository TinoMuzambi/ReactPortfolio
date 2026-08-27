import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaUniversity } from "react-icons/fa";

import type { TimelineItem } from "../types/portfolio";

interface EducationProps {
	education: TimelineItem[];
}

const Education = ({ education }: EducationProps) => {
	return (
		<div className="education">
			<h2 id="education-heading" className="title">
				Education
			</h2>

			<VerticalTimeline className="timeline">
				{education.map((item) => (
					<VerticalTimelineElement
						key={`${item.institution}|${item.title}|${item.period}`}
						className="vertical-timeline-element--work"
						contentStyle={{
							background: " rgba(55, 237, 83, 0.4)",
							color: "#fff",
							marginTop: "2rem",
							width: "42%",
						}}
						iconStyle={{
							background: "#0ce3f2",
							color: "#fff",
							marginTop: "1rem",
						}}
						iconClassName="round"
						icon={<FaUniversity aria-hidden="true" focusable="false" />}
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

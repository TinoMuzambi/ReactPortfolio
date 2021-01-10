import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaUniversity } from "react-icons/fa";

const Education = () => {
	return (
		<div className="education">
			<h1 className="title">Education</h1>

			<VerticalTimeline className="timeline">
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{
						background: " rgba(55, 237, 83, 0.4)",
						color: "#fff",
						marginTop: "2rem",
						width: "42%",
					}}
					date="2011 - present"
					dateClassName="date"
					iconStyle={{
						background: "#0ce3f2",
						color: "#fff",
						marginTop: "1rem",
					}}
					icon={<FaUniversity />}
					visible={true}
				>
					<h3 className="vertical-timeline-element-title">Creative Director</h3>
					<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
					<p>
						Creative Direction, User Experience, Visual Design, Project
						Management, Team Leading
					</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{
						background: " rgba(55, 237, 83, 0.4)",
						color: "#fff",
						marginTop: "2rem",
						width: "42%",
					}}
					date="2011 - present"
					dateClassName="date"
					iconStyle={{
						background: "#0ce3f2",
						color: "#fff",
						marginTop: "1rem",
					}}
					icon={<FaUniversity />}
					visible={true}
				>
					<h3 className="vertical-timeline-element-title">Creative Director</h3>
					<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
					<p>
						Creative Direction, User Experience, Visual Design, Project
						Management, Team Leading
					</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{
						background: " rgba(55, 237, 83, 0.4)",
						color: "#fff",
						marginTop: "2rem",
						width: "42%",
					}}
					date="2011 - present"
					dateClassName="date"
					iconStyle={{
						background: "#0ce3f2",
						color: "#fff",
						marginTop: "1rem",
					}}
					icon={<FaUniversity />}
					visible={true}
				>
					<h3 className="vertical-timeline-element-title">Creative Director</h3>
					<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
					<p>
						Creative Direction, User Experience, Visual Design, Project
						Management, Team Leading
					</p>
				</VerticalTimelineElement>
			</VerticalTimeline>
		</div>
	);
};

export default Education;

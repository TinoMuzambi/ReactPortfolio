import React from "react";
import Image from "next/image";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const Experience = ({ experience }) => {
	return (
		<div className="experience">
			<h2 id="experience-heading" className="title">
				Experience
			</h2>

			<VerticalTimeline className="timeline">
				{experience.map((item) => (
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
							background: "#0ce3f2aa",
							marginTop: "1rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						icon={
							<Image
								src={item.icon}
								alt={`${item.institution || item.title} logo`}
								width={48}
								height={48}
								style={{ objectFit: "contain" }}
							/>
						}
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

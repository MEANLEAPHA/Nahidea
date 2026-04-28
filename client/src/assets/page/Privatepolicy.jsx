
import React, { useRef, useState } from "react";
import { Timeline } from "antd";
import "../style/page/Privacypolicy.css";

import nahideaTran from "../img/nahidea-tran.png";
import { data } from "react-router-dom";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "platform", title: "Public Platform" },
  { id: "data-collection", title: "Data Collection" },
  { id: "data-usage", title: "Data Usage" },
  { id: "data-sharing", title: "Data Sharing" },
  { id: "data-protection", title: "Data Protection" },
  { id: "rights", title: "Your Rights" },
  { id: "anonymous", title: "Anonymous Usage" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Policy Changes" },
  { id: "contact", title: "Contact" }
];

export const revisions = [
   { date: "2025-12-30", },
  { date: "2025-12-29", url_link: "https://example.com/privacy-policy/2025-12-29"},
  { date: "2026-01-06", url_link: "https://example.com/privacy-policy/2026-01-06"},
  { date: "2025-12-32", url_link: "https://example.com/privacy-policy/2025-12-31"},
];


const Loader = () => {
  return (
    <div className="loader-container">
      <img src={nahideaTran} alt="Loading..." className="loader-img" />
    </div>
  );
};

export default function PrivacyPolicy() {
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState("introduction");
  const scrollTo = (id) => {
    setActiveId(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="privacy-container">

      {/* LEFT NAV */}
      <div className="timeline-container">
        <Timeline
          items={sections.map((sec) => ({
            color: "var(--primary-color)",
            children: (
              <span
                className={`timeline-item ${activeId === sec.id ? "active" : ""}`}
                onClick={() => scrollTo(sec.id)}
              >
                {sec.title}
              </span>
            )
          }))}
        />

        <div className="revision-box">
          <h4>Revisions</h4>
          <ul>
            {revisions.map((rev, i) => (
              <li key={i}>
                <a href={rev.url_link} target="_blank">{rev.date}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="content-container">
        <h1>Nahidea Privacy Policy</h1>
        <p className="effective">
          Effective: Jan 06, 2026 | Last Updated: Jan 06, 2026
        </p>

        {sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            ref={(el) => (sectionRefs.current[sec.id] = el)}
            className={activeId === sec.id ? "section active-section" : "section"}
          >
            <h2 className={activeId === sec.id ? "active-title" : ""}>{sec.title}</h2>

            {/* content mock (you can expand later easily) */}
            <p>
              This section explains details about {sec.title.toLowerCase()}.
              Replace this content with your actual policy text.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
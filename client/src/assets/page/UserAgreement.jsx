import React, { useRef, useState } from "react";
import "../style/page/UserAgreement.css";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing or using Nahidea, you agree to be bound by this User Agreement. If you do not agree, you may not use the platform."
  },
  {
    id: "account",
    title: "User Accounts",
    content:
      "You are responsible for maintaining the security of your account and any activities that occur under it. You must provide accurate information and keep it updated."
  },
  {
    id: "content",
    title: "User Content",
    content:
      "You retain ownership of content you post. By submitting content, you grant Nahidea a non-exclusive, worldwide license to use, display, and distribute it within the platform."
  },
  {
    id: "conduct",
    title: "Acceptable Use",
    content:
      "You agree not to misuse the platform, including posting harmful, abusive, illegal, or misleading content. Violations may result in suspension or removal."
  },
  {
    id: "privacy",
    title: "Privacy",
    content:
      "Your use of Nahidea is also governed by our Privacy Policy. Please review how we collect and handle your data."
  },
  {
    id: "termination",
    title: "Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate our policies or harm the platform or its users."
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content:
      "We may update this agreement from time to time. Continued use of Nahidea after changes means you accept the revised terms."
  },
  {
    id: "contact",
    title: "Contact",
    content:
      "For questions regarding this agreement, contact us at support@nahidea.com."
  }
];

export default function UserAgreement() {
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState("acceptance");

  const scrollTo = (id) => {
    setActiveId(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="agreement-container">

      {/* SIDE NAV */}
      <div className="agreement-nav">
        {sections.map((sec) => (
          <span
            key={sec.id}
            className={`nav-itemUa ${
              activeId === sec.id ? "active" : ""
            }`}
            onClick={() => scrollTo(sec.id)}
          >
            {sec.title}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div className="agreement-content">
        <h1>User Agreement</h1>
        <p className="effective">
          Effective: Jan 06, 2026
        </p>

        {sections.map((sec) => (
          <section
            key={sec.id}
            ref={(el) => (sectionRefs.current[sec.id] = el)}
            className={`section ${
              activeId === sec.id ? "active-section" : ""
            }`}
          >
            <h2 className={activeId === sec.id ? "active-title" : ""}>
              {sec.title}
            </h2>
            <p>{sec.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
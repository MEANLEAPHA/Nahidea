import React,{ useState, useEffect, useRef, memo } from 'react';
import "../style/page/UserAgreement.css";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing, registering for, or using Nahidea, you agree to comply with this User Agreement and all applicable platform policies. If you do not agree with any part of these terms, you must discontinue use of the platform immediately. Your continued use of Nahidea confirms your acceptance of any future updates or revisions to this agreement."
  },

  {
    id: "account",
    title: "User Accounts",
    content:
      "Users are responsible for maintaining the confidentiality and security of their accounts, passwords, and login credentials. You agree to provide accurate and complete registration information and to keep it updated. You are fully responsible for all activity conducted through your account, whether authorized by you or not."
  },

  {
    id: "content",
    title: "User Content",
    content:
      "You retain ownership of the content you create and publish on Nahidea. However, by uploading or sharing content, you grant Nahidea a worldwide, non-exclusive, royalty-free license to host, display, distribute, reproduce, and promote such content solely for operating and improving the platform. Users are responsible for ensuring they have the rights to any content they post."
  },

  {
    id: "conduct",
    title: "Acceptable Use",
    content:
      "You agree not to misuse Nahidea or engage in activities that harm the platform, its users, or its infrastructure. Prohibited activities include harassment, spam, misinformation, illegal conduct, automated abuse, unauthorized data collection, impersonation, or attempts to bypass platform restrictions. Violations may result in content removal, temporary suspension, or permanent account termination."
  },

  {
    id: "privacy",
    title: "Privacy and Data",
    content:
      "Your privacy is important to us. By using Nahidea, you acknowledge that certain information may be collected, processed, and stored to provide platform functionality, security, analytics, and moderation. Please review our Privacy Policy to better understand how your information is handled."
  },

  {
    id: "termination",
    title: "Account Suspension or Termination",
    content:
      "Nahidea reserves the right to suspend, restrict, or terminate accounts that violate this agreement, community rules, or applicable laws. We may also remove content that threatens platform integrity, user safety, or legal compliance. Certain enforcement actions may occur without prior warning depending on the severity of the violation."
  },

  {
    id: "liability",
    title: "Limitation of Liability",
    content:
      "Nahidea is provided on an 'as available' basis without guarantees of uninterrupted service, accuracy, or reliability. To the maximum extent permitted by law, Nahidea and its operators shall not be liable for indirect damages, data loss, service interruptions, or user-generated content published through the platform."
  },

  {
    id: "changes",
    title: "Changes to Terms",
    content:
      "We may revise or update this User Agreement periodically to reflect platform improvements, legal requirements, or policy changes. Updated terms become effective once published on the platform. Continued use of Nahidea after updates constitutes acceptance of the revised agreement."
  },

  {
    id: "contact",
    title: "Contact Information",
    content:
      "If you have questions, concerns, or legal inquiries regarding this User Agreement or the platform, you may contact the Nahidea support team through the official support channels provided within the platform."
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


import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "antd";

import "../style/page/Privacypolicy.css";
const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "platform", title: "Nahidea as a Public Platform" },
  { id: "data-collection", title: "Information We Collect" },
  { id: "data-usage", title: "How We Use Information" },
  { id: "data-sharing", title: "How We Share Information" },
  { id: "data-protection", title: "How We Protect Information" },
  { id: "rights", title: "Your Rights and Choices" },
  { id: "anonymous", title: "Anonymous Usage & Tokens" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" }
];

// scalable revisions
export const revisions = [
  { date: "2026-01-06" },
  // add more here
];

export default function PrivacyPolicy() {
  const [active, setActive] = useState("introduction");
  const sectionRefs = useRef({});

 

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="privacy-container">
      {/* LEFT TIMELINE */}
      <div className="timeline-container">
        <Timeline
          items={sections.map((sec) => ({
          
            children: (
              <span
                className={`timeline-item ${
                  active === sec.id ? "active" : ""
                }`}
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
              <li key={i}>{rev.date}</li>
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

        {/* SECTIONS */}

        <section ref={(el) => (sectionRefs.current["introduction"] = el)} id="introduction">
          <h2>Introduction</h2>
          <p>
            Nahidea is a social platform designed to enable users to share ideas,
            ask questions, provide answers, and support others through knowledge,
            experience, and community interaction.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our services.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["platform"] = el)} id="platform">
          <h2>Nahidea as a Public Platform</h2>
          <p>
            Nahidea operates as a largely public platform. Content you post,
            including questions, answers, and discussions, may be visible to
            other users and the public.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["data-collection"] = el)} id="data-collection">
          <h2>Information We Collect</h2>
          <ul>
            <li>Account information (username, email)</li>
            <li>User-generated content</li>
            <li>Usage data (interactions, activity logs)</li>
            <li>Device and technical information</li>
          </ul>
        </section>

        <section ref={(el) => (sectionRefs.current["data-usage"] = el)} id="data-usage">
          <h2>How We Use Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Operate and improve the platform</li>
            <li>Personalize user experience</li>
            <li>Moderate content and prevent abuse</li>
            <li>Ensure system security</li>
          </ul>
        </section>

        <section ref={(el) => (sectionRefs.current["data-sharing"] = el)} id="data-sharing">
          <h2>How We Share Information</h2>
          <p>
            We do not sell personal data. Information may be shared:
          </p>
          <ul>
            <li>With service providers</li>
            <li>For legal compliance</li>
            <li>To enforce platform policies</li>
          </ul>
        </section>

        <section ref={(el) => (sectionRefs.current["data-protection"] = el)} id="data-protection">
          <h2>How We Protect Information</h2>
          <p>
            We implement reasonable technical and organizational measures to
            protect your data. However, no system is fully secure.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["rights"] = el)} id="rights">
          <h2>Your Rights and Choices</h2>
          <ul>
            <li>Access your data</li>
            <li>Request deletion</li>
            <li>Control visibility of content</li>
          </ul>
        </section>

        <section ref={(el) => (sectionRefs.current["anonymous"] = el)} id="anonymous">
          <h2>Anonymous Usage & Tokens</h2>
          <p>
            Nahidea supports limited anonymous interactions through a token-based
            system. Abuse of anonymity may result in restrictions or removal.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["children"] = el)} id="children">
          <h2>Children</h2>
          <p>
            Nahidea is not intended for users under 13. We do not knowingly
            collect data from children.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["changes"] = el)} id="changes">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Continued use of Nahidea
            indicates acceptance of the updated policy.
          </p>
        </section>

        <section ref={(el) => (sectionRefs.current["contact"] = el)} id="contact">
          <h2>Contact Us</h2>
          <p>
            For privacy-related inquiries, contact: support@nahidea.com
          </p>
        </section>
      </div>
    </div>
  );
}
import React, { useRef, useState, useEffect } from "react";
import "../style/page/Rule.css";

const rules = [
  {
    id: "respect",
    title: "Be Respectful",
    content:
      "Treat others with respect. Harassment, hate speech, or personal attacks are not allowed."
  },
  {
    id: "authentic",
    title: "Be Authentic",
    content:
      "Do not impersonate others or misrepresent your identity. Use the platform honestly."
  },
  {
    id: "content",
    title: "Post Quality Content",
    content:
      "Share meaningful, relevant, and helpful content. Avoid spam, low-effort posts, or repetitive submissions."
  },
  {
    id: "misinformation",
    title: "No Misinformation",
    content:
      "Do not spread false or misleading information. Content should be accurate to the best of your knowledge."
  },
  {
    id: "safety",
    title: "Keep It Safe",
    content:
      "Do not post harmful, illegal, or dangerous content. This includes threats, self-harm encouragement, or exploitation."
  },
  {
    id: "privacy",
    title: "Respect Privacy",
    content:
      "Do not share personal or sensitive information without consent."
  },
  {
    id: "spam",
    title: "No Spam or Abuse",
    content:
      "Avoid excessive self-promotion, bots, or attempts to manipulate engagement."
  },
  {
    id: "moderation",
    title: "Follow Moderation",
    content:
      "Respect decisions made by moderators. Violations may result in content removal or account restrictions."
  }
];

export default function Rule() {
  const refs = useRef({});
  const [activeId, setActiveId] = useState(rules[0].id);

  const scrollTo = (id) => {
    setActiveId(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Scroll sync */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(refs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="rules-container">

      {/* NAV */}
      <div className="rules-nav">
        {rules.map((rule) => (
          <span
            key={rule.id}
            className={`nav-item ${activeId === rule.id ? "active" : ""}`}
            onClick={() => scrollTo(rule.id)}
          >
            {rule.title}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div className="rules-content">
        <h1>Community Rules</h1>
        <p className="subtitle">
          Nahidea is a place to share ideas, ask questions, and help others. These rules keep the space safe and useful for everyone.
        </p>

        {rules.map((rule, index) => (
          <section
            key={rule.id}
            id={rule.id}
            ref={(el) => (refs.current[rule.id] = el)}
            className={`rule-card ${
              activeId === rule.id ? "active-card" : ""
            }`}
          >
            <div className="rule-header">
              <span className="rule-number">{index + 1}</span>
              <h2 className={activeId === rule.id ? "active-title" : ""}>
                {rule.title}
              </h2>
            </div>

            <p>{rule.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
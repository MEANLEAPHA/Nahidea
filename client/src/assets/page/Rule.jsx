import React,{ useState, useEffect, useRef, memo } from 'react';

import "../style/page/Rule.css";

const rules = [
  {
    id: "respect",
    title: "Be Respectful",
    content:
      "Treat everyone with basic respect, even during disagreements. Personal attacks, harassment, hate speech, intimidation, or targeted bullying are not tolerated. Criticize ideas constructively instead of attacking individuals. A healthy community is built on discussion, not hostility."
  },
  {
    id: "authentic",
    title: "Be Authentic",
    content:
      "Do not impersonate other people, organizations, or public figures. Avoid fake engagement, misleading identities, or dishonest behavior designed to manipulate trust. People should feel confident that conversations and interactions on Nahidea are genuine."
  },
  {
    id: "content",
    title: "Post Valuable Content",
    content:
      "Share content that informs, inspires, teaches, entertains, or meaningfully contributes to discussion. Avoid repetitive spam, meaningless reposts, engagement bait, or low-effort submissions. Quality matters more than quantity."
  },
  {
    id: "misinformation",
    title: "No Misinformation",
    content:
      "Do not intentionally spread false, deceptive, or manipulated information. When sharing news, facts, tutorials, or advice, make a reasonable effort to ensure accuracy. Misleading content that could harm people or manipulate public trust may be removed."
  },
  {
    id: "safety",
    title: "Keep The Community Safe",
    content:
      "Content involving threats, violence, criminal activity, exploitation, self-harm encouragement, or dangerous behavior is strictly prohibited. Nahidea should remain a safe environment where users can participate without fear or harm."
  },
  {
    id: "privacy",
    title: "Respect Privacy",
    content:
      "Never share private or sensitive information without clear consent. This includes addresses, passwords, phone numbers, personal documents, financial details, or private conversations. Respect the boundaries and safety of others."
  },
  {
    id: "spam",
    title: "No Spam or Manipulation",
    content:
      "Avoid excessive self-promotion, fake giveaways, referral abuse, automated posting, or attempts to artificially manipulate engagement metrics. Build attention through genuine value instead of exploiting the system."
  },
  {
    id: "moderation",
    title: "Follow Moderation Decisions",
    content:
      "Moderators may remove content or restrict accounts to protect the platform and community experience. Repeated violations, attempts to bypass enforcement, or abuse toward moderators can result in stronger penalties, including permanent suspension."
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
            className={`nav-itemR ${activeId === rule.id ? "active" : ""}`}
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

            <p className="rule-content">{rule.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
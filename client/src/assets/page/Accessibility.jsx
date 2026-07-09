import "../style/page/Accessibility.css";

function Card({ className = "", delay = 0, children }) {
  return (
    <div
      className={`a11y-card a11y-animate ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
function Eyebrow({ children, tone = "muted" }) {
  return <span className={`a11y-eyebrow ${tone === "brand" ? "brand" : tone === "on-dark" ? "on-dark" : tone === "on-brand" ? "on-brand" : ""}`}>{children}</span>;
}
function ShortcutRow({ label, keys }) {
  return (
    <div className="a11y-shortcut-row">
      <span className="a11y-shortcut-label">{label}</span>
      <kbd className="a11y-shortcut-key">{keys}</kbd>
    </div>
  );
}
function TechPill({ name }) {
  return <div className="a11y-tech-pill">{name}</div>;
}
const SHORTCUTS = [
  { label: "Cycle navigation forward", keys: "TAB" },
  { label: "Cycle navigation backward", keys: "SHIFT + TAB" },
];
const VISUAL_ITEMS = [
  "Responsive layouts for common screen sizes",
  "Readable light & dark themes",
];
const TECH = ["NVDA", "VoiceOver"];
const LIMITS = [
  { title: "Rich-text editor", body: "Some toolbar controls don't yet have keyboard shortcuts." },
];
export default function Accessibility() {
  return (
    <div className="a11y-page">
      <a href="#main-content" className="a11y-skip">Skip to main content</a>
      <div className="a11y-nav">
        <div className="a11y-nav-right">
          <a href="#feedback" className="a11y-nav-link">Feedback</a>
          <div className="a11y-nav-divider" />
          <span className="a11y-nav-meta">Last Update: Jan 2026</span>
        </div>
      </div>
      <div id="main-content" className="a11y-hero">
        <div className="a11y-animate">
          <h1>
            Access<em>ibility</em>
          </h1>
          <p>
            We're working to make Nahidea usable for everyone. Accessibility is
            something we're actively improving, not something we've fully solved.
          </p>
        </div>
      </div>
      <div className="a11y-grid">
        <Card className="span-8 a11y-commitment" delay={100}>
          <div className="a11y-commitment-body">
            <Eyebrow tone="brand">01 — Our Commitment</Eyebrow>
            <h2>Working Toward Inclusive Design</h2>
            <p>
              We want everyone to be able to read, write, and engage with content
              on Nahidea. We're gradually improving our design to be more inclusive,
              with WCAG guidelines as our reference point.
            </p>
          </div>
          <div className="a11y-tags">
            <span className="a11y-tag brand">In Progress</span>
          </div>
        </Card>
        <Card className="span-4 dark" delay={150}>
          <Eyebrow tone="on-dark">02 — Visuals</Eyebrow>
          <h3>Visual Support</h3>
          <ul className="a11y-visual-list">
            {VISUAL_ITEMS.map((item) => (
              <li key={item}>
                <span className="a11y-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="span-4" delay={200}>
          <Eyebrow>03 — Screen Readers</Eyebrow>
          <h3>Basic Support</h3>
          <div className="a11y-tech-grid">
            {TECH.map((name) => <TechPill key={name} name={name} />)}
          </div>
          <p className="a11y-tech-note">
            Basic testing done with common screen readers.
          </p>
        </Card>
        <Card className="span-8 secondary" delay={250}>
          <div className="a11y-shortcuts-header">
            <div>
              <Eyebrow>04 — Navigation</Eyebrow>
              <h3>Keyboard Shortcuts</h3>
            </div>
          </div>
          <div>
            {SHORTCUTS.map((s) => <ShortcutRow key={s.label} {...s} />)}
          </div>
        </Card>
        <Card className="span-6" delay={300}>
          <Eyebrow>05 — Future</Eyebrow>
          <h3>What We're Working On</h3>
          <p style={{ marginBottom: 24, fontSize: 14 }}>
            We're planning improvements to focus indicators and expanding alt-text
            support for images over time.
          </p>
        </Card>
        <Card className="span-6 brand" delay={350}>
          <div id="feedback" />
          <Eyebrow tone="on-brand">06 — Help</Eyebrow>
          <h3>Found a barrier?</h3>
          <p>
            If something isn't accessible for you, let us know and we'll look into it.
          </p>
          <a href="mailto:support@nahidea.com">support@nahidea.com</a>
        </Card>
        <Card className="span-12" delay={400}>
          <Eyebrow>07 — Transparency</Eyebrow>
          <h3>Known Limitations</h3>
          <p style={{ marginBottom: 24, fontSize: 14, maxWidth: 720 }}>
            We're being upfront about what still needs work.
          </p>
          <ul className="a11y-limits">
            {LIMITS.map((item) => (
              <li key={item.title} className="a11y-limit">
                <div className="a11y-limit-tag">In progress</div>
                <div className="a11y-limit-title">{item.title}</div>
                <p className="a11y-limit-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="a11y-footer">
        <div className="a11y-footer-note">
          Nahidea Accessibility Statement. Last updated January 2026.
        </div>
        <div className="a11y-footer-status">
          <div className="a11y-status-dot" />
          <span>Active Monitoring</span>
        </div>
      </div>
    </div>
  );
}
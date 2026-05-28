
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
  { label: "Global search", keys: "⌘ K" },
  { label: "Cycle navigation forward", keys: "TAB" },
  { label: "Cycle navigation backward", keys: "SHIFT + TAB" },
  { label: "Skip to main content", keys: "ALT + S" },
  { label: "Toggle theme", keys: "ALT + T" },
  { label: "Open command palette", keys: "⌘ /" },
];
const VISUAL_ITEMS = [
  "Responsive layouts for any viewport size",
  "Contrast-tested light & dark themes",
  "Scalable typography up to 200% zoom",
  "Reduced motion system preferences",
];
const TECH = ["NVDA", "JAWS", "VoiceOver", "TalkBack", "Narrator", "Orca"];
const LIMITS = [
  { title: "Rich-text editor", body: "Some toolbar controls lack discoverable keyboard shortcuts." },
  { title: "Embedded media", body: "User-uploaded videos may not yet include captions or transcripts." },
  { title: "Legacy charts", body: "Older dashboard visualizations lack accessible data table fallbacks." },
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
            Nahidea is built to be usable by everyone. We treat accessibility not as a
            compliance checkbox, but as the fundamental architecture of our interface.
          </p>
        </div>
      </div>
      <div className="a11y-grid">
        <Card className="span-8 a11y-commitment" delay={100}>
          <div className="a11y-commitment-body">
            <Eyebrow tone="brand">01 — Our Commitment</Eyebrow>
            <h2>Inclusive by Default</h2>
            <p>
              Our goal is to ensure that everyone — regardless of ability, device, or
              context — can read, write, and engage with content without barriers. We align
              our design system with WCAG 2.1 AA standards and treat inclusive design as a
              prerequisite to shipping, not an afterthought.
            </p>
          </div>
          <div className="a11y-tags">
            <span className="a11y-tag brand">WCAG 2.1 AA</span>
            <span className="a11y-tag">Verified 2026</span>
            <span className="a11y-tag">Section 508 aligned</span>
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
          <Eyebrow>03 — Assistive Tech</Eyebrow>
          <h3>Compatibility</h3>
          <div className="a11y-tech-grid">
            {TECH.map((name) => <TechPill key={name} name={name} />)}
          </div>
          <p className="a11y-tech-note">
            Tested on latest stable releases across macOS, Windows, iOS, Android, and Linux.
          </p>
        </Card>
        <Card className="span-8 secondary" delay={250}>
          <div className="a11y-shortcuts-header">
            <div>
              <Eyebrow>04 — Navigation</Eyebrow>
              <h3>Keyboard Shortcuts</h3>
            </div>
            <span className="a11y-badge">Terminal Mode</span>
          </div>
          <div>
            {SHORTCUTS.map((s) => <ShortcutRow key={s.label} {...s} />)}
          </div>
        </Card>
        <Card className="span-6" delay={300}>
          <Eyebrow>05 — Future</Eyebrow>
          <h3>Ongoing Roadmap</h3>
          <p style={{ marginBottom: 24, fontSize: 14 }}>
            We are currently refining focus indicators across complex data tables,
            expanding alt-text coverage for user-generated media, and auditing color
            contrast on legacy surfaces.
          </p>
          <div className="a11y-progress"><div className="a11y-progress-bar" /></div>
          <div className="a11y-progress-meta">
            <span>75% of Q1 roadmap complete</span>
            <span>v2.4.0</span>
          </div>
        </Card>
        <Card className="span-6 brand" delay={350}>
          <div id="feedback" />
          <Eyebrow tone="on-brand">06 — Help</Eyebrow>
          <h3>Found a barrier?</h3>
          <p>
            If you experience any accessibility issue or need assistance using Nahidea, our
            team will respond within 2 business days and prioritize remediation.
          </p>
          <a href="mailto:support@nahidea.com">support@nahidea.com</a>
        </Card>
        <Card className="span-12" delay={400}>
          <Eyebrow>07 — Transparency</Eyebrow>
          <h3>Known Limitations</h3>
          <p style={{ marginBottom: 24, fontSize: 14, maxWidth: 720 }}>
            We believe in being honest about gaps. The following areas are actively being
            worked on and may not yet fully conform to WCAG 2.1 AA.
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
          Nahidea Accessibility Statement. Built with intent. Conforms to WCAG 2.1 Level
          AA standards. Last updated January 2026.
        </div>
        <div className="a11y-footer-status">
          <div className="a11y-status-dot" />
          <span>Active Monitoring</span>
        </div>
      </div>
    </div>
  );
}
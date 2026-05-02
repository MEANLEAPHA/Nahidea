import React, { useState, useEffect, useRef, memo } from 'react';
import "../style/page/Accessibility.css";

export default function Accessibility() {
  return (
    <div className="access-container">

      <div className="access-content">
        <h1>Accessibility</h1>
        <p className="subtitle">
          Nahidea is built to be usable by everyone. We are continuously improving
          accessibility so all users can participate equally.
        </p>

        <section>
          <h2>Our Commitment</h2>
          <p>
            We are committed to making Nahidea accessible and inclusive for people of
            all abilities. Our goal is to ensure that everyone can read, write, and
            engage with content without barriers.
          </p>
        </section>

        <section>
          <h2>What We Support</h2>
          <ul>
            <li>Responsive design for mobile, tablet, and desktop</li>
            <li>Keyboard-friendly navigation</li>
            <li>Readable contrast with light and dark themes</li>
            <li>Semantic structure for screen readers</li>
          </ul>
        </section>

        <section>
          <h2>Ongoing Improvements</h2>
          <p>
            We are actively improving accessibility as the platform grows. Some
            features may still be in progress as we refine the experience.
          </p>
        </section>

        <section>
          <h2>Need Help?</h2>
          <p>
            If you experience any accessibility issues or need assistance using
            Nahidea, please contact us at{" "}
            <span className="highlight">support@nahidea.com</span>.
          </p>
        </section>

        <p className="footer-note">
          Last updated: January 2026
        </p>
      </div>
    </div>
  );
}
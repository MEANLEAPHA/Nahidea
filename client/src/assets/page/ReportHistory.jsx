// ReportHistory.jsx
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation,  } from "@fortawesome/free-solid-svg-icons";
import {faBloggerB} from "@fortawesome/free-brands-svg-icons"
import "../style/page/ReportHistory.css";

function ReportItem({ item }) {
  return (
    <div className="report-item">
      <div className="report-type">
        <div className="report-video-icon">
          <span className="material-symbols-outlined"><FontAwesomeIcon icon={faBloggerB} /></span>
        </div>

        <div className="report-type-text">
          <span>Video</span>
        </div>
      </div>

      <div className="report-content">
        <div className="report-title">{item.title}</div>
        <div className="report-channel">{item.channel}</div>
      </div>

      <div className="report-reason">
        <div className="report-reason-title">{item.reason}</div>
        <div className="report-date">{item.date}</div>
      </div>

      <div
        className={`report-status ${
          item.status.toLowerCase() === "live"
            ? "status-live"
            : "status-removed"
        }`}
      >
        {item.status}
      </div>
    </div>
  );
}

export default function ReportHistory() {
  /*
    Replace this with your API later.

    Example:
    useEffect(() => {
      fetch("YOUR_API")
        .then(res => res.json())
        .then(data => setReports(data))
    }, [])
  */

  const reports = [
    {
      id: 1,
      title: "Top 5 Shark Tank AI Moments ft. Down-Z's Friends",
      channel: "NooodleGG",
      reason: "Harassment or bullying",
      date: "Oct 16, 2025",
      status: "Live",
    },
    {
      id: 2,
      title: "X-Mobile Under 4000",
      channel: "Edit Zone",
      reason: "Sexual content",
      date: "Aug 23, 2025",
      status: "Live",
    },
    {
      id: 3,
      title: "First Combat Use of Saab Gripen in Cambodia-Thailand Conflict",
      channel: "Defense News",
      reason: "Misinformation",
      date: "Jul 29, 2025",
      status: "Live",
    },
    {
      id: 4,
      title: "Rules Of Survival Gold Mode",
      channel: "CHANMUNY",
      reason: "Harmful dangerous acts",
      date: "Jul 12, 2025",
      status: "Removed",
    },
  ];

  return (
    <div className="report-history-page">
      <div className="report-history-container">
        {/* TOP */}
        <div className="report-history-top">
          <div className="report-history-info">
            <div className="report-history-heading">
              Thanks for reporting
            </div>

            <div className="report-history-desc">
              Reports submitted by users are reviewed based on community
              guidelines. Content may be removed, restricted, or remain active
              depending on the review result.
            </div>

            <div className="report-history-note">
             Reporting does not guarantee automatic remova!
            </div>
          </div>

          <div className="report-history-illustration">
            <div className="report-blob">
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="report-table-header">
          <div>Type</div>
          <div>Content</div>
          <div>Reporting reason</div>
          <div>Status</div>
        </div>

        {/* DATA */}
        <div className="report-table-body">
          {reports.map((item) => (
            <ReportItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
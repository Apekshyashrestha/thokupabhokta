import React from "react";
import { SITE_INFO } from "../data/siteData";

export default function TopHeader({ setActiveTab }) {
  return (
    <div className="top-bar">
      {/* Contact Info (Left Side) */}
      <div className="top-bar-left">
        <span className="top-info-item">
          <span className="icon">📞</span>
          {SITE_INFO.phone}
        </span>
        <span className="top-info-item">
          <span className="icon">✉️</span>
          {SITE_INFO.email}
        </span>
      </div>

      {/* Action Buttons (Right Side) */}
      <div className="top-bar-right">
        <button className="top-bar-btn" onClick={() => setActiveTab("notice")}>
          <span className="icon">🔔</span> NOTICE
        </button>
        <button className="top-bar-btn" onClick={() => setActiveTab("reports")}>
          <span className="icon">📄</span> REPORTS
        </button>
        <button className="top-bar-btn" onClick={() => setActiveTab("events")}>
          <span className="icon">📅</span> EVENTS
        </button>
      </div>
    </div>
  );
}
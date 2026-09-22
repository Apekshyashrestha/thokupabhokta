import React from "react";
import { SITE_INFO } from "../data/siteData";

export default function TickerBar() {
  return (
    <div className="ticker-bar">
      <div className="ticker-tag">LIVE UPDATE</div>
      <div className="ticker-track">
        <div className="ticker-track-inner">{SITE_INFO.tickerText} &nbsp; • &nbsp; {SITE_INFO.tickerText}</div>
      </div>
    </div>
  );
}

import { useContent } from "../content/useContent";

export default function TickerBar() {
  const { siteInfo } = useContent();
  const text = siteInfo.tickerText || "";

  return (
    <div className="ticker-bar">
      <div className="ticker-tag">LIVE UPDATE</div>
      <div className="ticker-track">
        <div className="ticker-track-inner">{text} &nbsp; • &nbsp; {text}</div>
      </div>
    </div>
  );
}

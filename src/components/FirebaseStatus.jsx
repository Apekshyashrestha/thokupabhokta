import { isConfigured, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";

export default function FirebaseStatus() {
  const [status, setStatus] = useState(isConfigured ? "checking..." : "static fallback");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!isConfigured) {
      setStatus("static fallback");
      setDetails("Paste config in .env → live Firestore");
      console.log("[Firebase] Not configured — using static data");
      return;
    }
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "products"), limit(1)));
        const hasData = !snap.empty;
        setStatus(hasData ? "Firebase Live ✅" : "Connected — empty (using fallback)");
        setDetails(hasData ? `${snap.size ? "products" : ""} from Firestore` : "Seed collections via scripts/seedFirestore.js");
        console.log(`[Firebase] Live — project: ${db.app.options.projectId}, products: ${hasData ? "found" : "empty fallback"}`);
      } catch (e) {
        setStatus("fallback (error)");
        setDetails(e.message.slice(0, 60));
        console.warn("[Firebase] Check failed", e);
      }
    })();
  }, []);

  const bg = status.includes("Live") ? "#f0fdf4" : status.includes("static") ? "#fef3c7" : "#fef2f2";
  const border = status.includes("Live") ? "#bbf7d0" : status.includes("static") ? "#fde68a" : "#fecaca";
  const dot = status.includes("Live") ? "#22c55e" : status.includes("static") ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bg, border: `1px solid ${border}`, padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: "#0f172a" }} title={details}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, boxShadow: `0 0 0 4px ${dot}33`, display: "inline-block" }} />
      {isConfigured ? status : "Firebase: not configured"} 
      <span style={{ fontWeight: 600, color: "#64748b", fontSize: 10 }}>{isConfigured ? `• ${db.app.options.projectId}` : "• static"}</span>
    </div>
  );
}

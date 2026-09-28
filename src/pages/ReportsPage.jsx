import { useState } from "react";
import { REPORTS as STATIC_REPORTS, SITE_INFO } from "../data/siteData";
import { useFirestoreCollection } from "../hooks/useFirestore";

export default function ReportsPage() {
  const { data: REPORTS } = useFirestoreCollection("reports", STATIC_REPORTS, "id");
  const [downloading, setDownloading] = useState(null);
  const [toast, setToast] = useState("");

  const handleDownload = (report) => {
    setDownloading(report.id);
    setToast(`Starting download: ${report.title}.pdf`);
    // Create temporary anchor for download (works cross-origin with target _blank)
    const a = document.createElement("a");
    a.href = report.file;
    a.target = "_blank";
    a.rel = "noreferrer";
    // For same-origin files `download` would force save; cross-origin just opens — still allows save via browser
    a.download = `${report.title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => setDownloading(null), 1500);
    setTimeout(() => setToast(""), 3000);
  };

  const handlePreview = (report) => {
    window.open(report.file, "_blank", "noreferrer");
  };

  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Reports</h2>
          <p>Home / Reports</p>
        </div>
      </div>

      <div className="reports-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <span className="section-eyebrow">Transparency & Accountability</span>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#052e16', marginTop: 8 }}>Annual & Audit Reports</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, maxWidth: 560 }}>Official AGM and audit documents of {SITE_INFO.name} — published for member cooperatives. All files are PDF and hosted on the union’s archive.</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, background: '#052e16', color: '#fff', padding: '8px 14px', borderRadius: 999 }}>{REPORTS.length} documents • PDF</span>
        </div>

        <div className="reports-card" style={{ overflow: 'hidden' }}>
          {/* Desktop table */}
          <div className="reports-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="reports-table">
              <thead>
                <tr>
                  <th style={{ width: 64 }}>SN</th>
                  <th>Title</th>
                  <th style={{ width: 150 }}>Published</th>
                  <th style={{ width: 120 }}>File</th>
                  <th style={{ width: 190, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {REPORTS.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: '#f1f5f9', borderRadius: 8, fontWeight: 800, fontSize: 12, border: '1px solid #e2e8f0' }}>{r.id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ width: 36, height: 36, borderRadius: 9, background: '#fef2f2', border: '1px solid #fecaca', display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0 }}>📄</span>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 13, lineHeight: 1.2 }}>{r.title}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{r.type} • {r.size}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge-date">📅 {r.publishedDate}</span></td>
                    <td><span style={{ fontSize: 11, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 8px', borderRadius: 999, color: '#64748b', fontWeight: 700 }}>{r.size} • PDF</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button
                          onClick={() => handlePreview(r)}
                          title="Preview PDF"
                          style={{ padding: '8px 12px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          👁 Preview
                        </button>
                        <button
                          onClick={() => handleDownload(r)}
                          disabled={downloading === r.id}
                          style={{ padding: '8px 14px', borderRadius: 999, background: downloading === r.id ? '#0f172a' : 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 11, border: 'none', opacity: downloading === r.id ? 0.85 : 1, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(34,197,94,0.22)' }}
                        >
                          {downloading === r.id ? '⏳ Downloading…' : '⬇ Download'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — hidden on desktop via CSS */}
          <div className="reports-mobile" style={{ display: 'none', padding: 12, gap: 12, flexDirection: 'column' }}>
            {REPORTS.map((r) => (
              <div key={r.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 9, background: '#fff', border: '1px solid #e2e8f0', display: 'grid', placeItems: 'center' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.publishedDate} • {r.size}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => handlePreview(r)} style={{ flex: 1, padding: '10px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: 12 }}>Preview</button>
                  <button onClick={() => handleDownload(r)} style={{ flex: 1, padding: '10px', borderRadius: 999, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 12, border: 'none' }}>⬇ Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, background: '#fff', border: '1px solid #eef2f7', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', border: '1px solid #dcfce7', display: 'grid', placeItems: 'center' }}>ℹ️</span>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, flex: 1 }}>
            Files are hosted at <strong style={{ color: '#0f172a' }}>thokupabhokta.coop.np/uploads/reports/</strong> — same as the official site. If a PDF doesn’t open, right-click Download → Save Link As, or contact <strong>{SITE_INFO.email}</strong> / {SITE_INFO.phone}.
          </p>
          <a href={`mailto:${SITE_INFO.email}?subject=Request%20for%20Reports`} style={{ padding: '8px 14px', borderRadius: 999, background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: 12 }}>Request via Email</a>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#052e16', color: '#fff', padding: '10px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 3000, border: '1px solid rgba(255,255,255,0.15)' }}>
          {toast}
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .reports-table-wrap { display: none; }
          .reports-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

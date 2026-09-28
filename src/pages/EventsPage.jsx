import { useState } from "react";
import { ALL_EVENTS as STATIC_EVENTS } from "../data/eventsData";
import { useFirestoreCollection } from "../hooks/useFirestore";

export default function EventsPage() {
  const { data: ALL_EVENTS } = useFirestoreCollection("events", STATIC_EVENTS, "id");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("");

  const filtered = ALL_EVENTS.filter((e) => (e.title||"").toLowerCase().includes(filter.toLowerCase()) || (e.excerpt||"").toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Events</h2>
          <p>Home / Events — {filtered.length} programs</p>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <span className="section-eyebrow">Recent Programs</span>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#052e16', marginTop: 8 }}>All Events & Programs</h3>
          </div>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search events..." style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, minWidth: 220 }} />
        </div>

        <div className="events-grid" style={{ marginTop: 16 }}>
          {filtered.map((ev) => (
            <article key={ev.id} onClick={() => setSelected(ev)} className="events-grid-card" style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}>
              <div style={{ height: 200, overflow: 'hidden', background: '#f1f5f9' }}>
                <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 800, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 999 }}>{ev.date}</span>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 10, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38, wordBreak: 'break-word' }}>{ev.title}</h4>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.excerpt}</p>
                <span style={{ display: 'inline-flex', marginTop: 10, fontSize: 11, fontWeight: 800, color: '#0f172a' }}>Read more →</span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 16, marginTop: 16 }}>No events found.</div>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => setSelected(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(2,18,10,0.62)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 18, maxWidth: 760, width: '100%', maxHeight: '86vh', overflow: 'auto', border: '1px solid #eef2f7' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 999, background: '#0f172a', color: '#fff', zIndex: 2 }}>✕</button>
            <img src={selected.image} alt={selected.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
            <div style={{ padding: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: 999 }}>{selected.date}</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 10 }}>{selected.title}</h3>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-wrap' }}>{selected.full}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

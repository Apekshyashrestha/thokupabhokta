import { useState } from "react";
import { RECENT_EVENTS } from "../data/eventsData";

export default function EventsPreview({ onViewAll }) {
  const [selected, setSelected] = useState(null);
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 20px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ minWidth: 0, flex: '1 1 260px' }}>
          <span className="section-eyebrow">Recent Programs</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#052e16', marginTop: 10 }}>Latest Events</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Community gatherings, AGMs, product launches & cooperative business meets across Koshi Province.</p>
        </div>
        <button onClick={onViewAll} style={{ padding: '10px 16px', borderRadius: 999, background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>Show More →</button>
      </div>

      <div className="events-grid">
        {RECENT_EVENTS.slice(0,3).map((ev) => (
          <article key={ev.id} onClick={() => setSelected(ev)} className="events-grid-card" style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}>
            <div style={{ height: 190, overflow: 'hidden', background: '#f1f5f9' }}>
              <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={(e)=> e.currentTarget.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} />
            </div>
            <div style={{ padding: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#15803d', background: '#f0fdf4', border: '1px solid #dcfce7', padding: '4px 8px', borderRadius: 999 }}>{ev.date}</span>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginTop: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38, wordBreak: 'break-word' }}>{ev.title}</h4>
              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.excerpt}</p>
              <span style={{ display: 'inline-flex', marginTop: 10, fontSize: 11, fontWeight: 800, color: '#0f172a' }}>Read more →</span>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <div onClick={() => setSelected(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(2,18,10,0.62)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 18, maxWidth: 760, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid #eef2f7', boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 999, background: '#0f172a', color: '#fff', zIndex: 2, border: 'none' }}>✕</button>
            <img src={selected.image} alt={selected.title} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
            <div style={{ padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: 999 }}>{selected.date}</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 10, wordBreak: 'break-word' }}>{selected.title}</h3>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{selected.full}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

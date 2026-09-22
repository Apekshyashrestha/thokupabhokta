import { CEO_MESSAGE } from "../data/eventsData";

export default function CeoMessageSection() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 20px 8px' }}>
      <div className="ceo-grid">
        <div className="ceo-grid-main">
          <span className="section-eyebrow">Message from Leadership</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#052e16', marginTop: 12 }}>Message from CEO</h3>
          <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-wrap' }}>{CEO_MESSAGE.message}</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: 999 }}>Vision: Sustainable cooperative business</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 999, color: '#475569' }}>First of its kind in Nepal</span>
          </div>
        </div>
        <div className="ceo-grid-side">
          <div style={{ width: 180, height: 180, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 12px 32px rgba(0,0,0,0.14)', background: '#fff', flexShrink: 0 }}>
            <img src={CEO_MESSAGE.image} alt={CEO_MESSAGE.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{e.currentTarget.style.display='none';}} />
          </div>
          <h4 style={{ marginTop: 14, fontWeight: 800, color: '#0f172a' }}>{CEO_MESSAGE.name}</h4>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#16a34a', background: '#fff', border: '1px solid #dcfce7', padding: '4px 10px', borderRadius: 999, marginTop: 6 }}>{CEO_MESSAGE.role}</span>
          <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 10, maxWidth: 260 }}>Umbrella of cooperatives — marketing goods & services, empowering entrepreneurs.</p>
        </div>
      </div>
    </section>
  );
}

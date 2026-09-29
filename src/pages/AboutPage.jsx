import { useState } from "react";
import { useContent } from "../content/useContent";

export default function AboutPage() {
  const { siteInfo, ceo, vision, committees, staff, memberCoops } = useContent();
  const sanchalak = committees.sanchalak;
  const lekha = committees.lekha;
  const [tab, setTab] = useState("about");

  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737852567-6949f3f9f5b5?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>About Us</h2>
          <p>Home / About Us</p>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { id: 'about', label: 'About Us' },
          { id: 'ceo', label: 'Message from CEO' },
          { id: 'members', label: 'Our Members' },
          { id: 'staff', label: 'Staff Structure' },
          { id: 'coops', label: 'Member Co-ops' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, border: '1px solid', borderColor: tab === t.id ? '#16a34a' : '#e2e8f0', background: tab === t.id ? '#052e16' : '#fff', color: tab === t.id ? '#fff' : '#334155' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'about' && (
        <div className="about-wrap">
          <span className="section-eyebrow">Who we are</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#052e16', marginTop: 12 }}>{siteInfo.name}</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>{siteInfo.englishName} — Est. {siteInfo.establishedDate} • Reg. No. {siteInfo.regNo} • {siteInfo.regOffice}</p>

          <div className="about-grid" style={{ marginTop: 18 }}>
            <div className="about-card">
              <h3>Welcome — कोशी प्रदेश विशिष्टिकृत सहकारी संघ</h3>
              <p style={{ marginTop: 8 }}>
                कोशी प्रदेश कार्यक्षेत्र रहेको यस थोक उपभोक्ता विशिष्टिकृत सहकारी संघ लि सहकारी ऐन २०७४ बमोजिम प्रदेश नं १ भर कार्यक्षेत्र रहने गरी समाग्रीहरु थोक आपुर्ति गर्ने, गुणस्तरीय समान आपुर्ति गर्ने विभिन्न उपभोग्य समाग्रीहरु उत्पादन गर्ने र विभिन्न उपभोग्य सामाग्री सर्व सुलभ रुपमा सहकारी मार्फत उपभोक्ताहरु माझ पुर्‍याउनका लागि मिती २०७८ अषाढ ९ मा प्रदेश नं १ सहकारी रजिष्ट्रार कार्यालय ईटहरीमा दर्ता भई स्थापित भएको हो ।
              </p>
              <p style={{ marginTop: 12 }}>
                प्रारम्भिक सहकारी संस्थाहरुका विभिन्न उपभोग्य समाग्रीहरुको उत्पादन गर्ने सहकारी संस्थाहरुमा उत्पदित वस्तुहरुलाई थोक मात्रामा खरिद गर्ने र ति वस्तुहरुलाई थप ब्राण्डिङ्ग गरी प्रारम्भिक सहकारीहरु मार्फत नै आम उपभोक्ताहरुमाझ पुर्याउने काममा यो संघ क्रियाशील रहेको छ। स्थापना कालदेखि राष्ट्रिय सहकारी महासंघ, राष्ट्रिय सहकारी बैंक लगायत सहकारी अभियानको सक्रियता र अतुलनीय सहयोग रहेको छ।
              </p>
            </div>
            <div className="about-facts">
              <div className="fact"><div className="fact-icon">🏛️</div><div><strong>Reg. Office</strong><span style={{ display: 'block' }}>{siteInfo.regOffice}</span></div></div>
              <div className="fact"><div className="fact-icon">📍</div><div><strong>Head Office</strong><span style={{ display: 'block' }}>Damak-9, Jhapa</span></div></div>
              <div className="fact"><div className="fact-icon">📦</div><div><strong>Products</strong><span style={{ display: 'block' }}>Tea, Honey, Mustard Oil, Handicrafts, Agro Tools</span></div></div>
              <div className="fact"><div className="fact-icon">🤝</div><div><strong>Network</strong><span style={{ display: 'block' }}>Cooperatives across Koshi Province</span></div></div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
            <div className="about-card">
              <h3>पृष्ठभूमि</h3>
              <p style={{ marginTop: 8, lineHeight: 1.9, wordBreak: 'break-word' }}>{vision.prishthabhumi}</p>
            </div>
            <div className="about-grid-2">
              <div className="about-card" style={{ background: 'linear-gradient(180deg,#f0fdf4,#fff)' }}>
                <h3>परिकल्पना</h3>
                <p style={{ marginTop: 8, fontWeight: 700, color: '#14532d', lineHeight: 1.7 }}>• {vision.parikalpana}</p>
              </div>
              <div className="about-card">
                <h3>ध्येय</h3>
                <ul style={{ marginTop: 8, paddingLeft: 18, display: 'grid', gap: 6, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                  {vision.dhyeya.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ceo' && (
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px 40px' }}>
          <div className="ceo-grid">
            <div className="ceo-grid-main">
              <span className="section-eyebrow">Leadership</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#052e16', marginTop: 10 }}>Message from CEO</h3>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ceo.message}</p>
            </div>
            <div className="ceo-grid-side">
              <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', flexShrink: 0 }}>
                <img src={ceo.image} alt={ceo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ marginTop: 12, fontWeight: 800 }}>{ceo.name}</h4>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#fff', border: '1px solid #dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 999 }}>{ceo.role}</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px 40px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#052e16', marginBottom: 12 }}>सञ्चालक समिति</h3>
          <div className="members-grid-4">
            {sanchalak.map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, overflow: 'hidden', textAlign: 'center', paddingBottom: 14 }}>
                <div style={{ height: 120, background: 'linear-gradient(180deg,#f0fdf4,#f8fafc)', display: 'grid', placeItems: 'center', fontSize: 32 }}>👤</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 10, padding: '0 8px', wordBreak: 'break-word' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{m.group}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{m.role}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#052e16', margin: '18px 0 12px' }}>लेखा समिति</h3>
          <div className="members-grid-3">
            {lekha.map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, overflow: 'hidden', textAlign: 'center', paddingBottom: 14 }}>
                <div style={{ height: 120, background: '#f8fafc', display: 'grid', placeItems: 'center', fontSize: 32 }}>👤</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 10, wordBreak: 'break-word' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{m.group}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'staff' && (
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px 40px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#052e16', marginBottom: 12 }}>कर्मचारी संरचना</h3>
          <div className="members-grid-3">
            {staff.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, overflow: 'hidden', textAlign: 'center', paddingBottom: 16 }}>
                <div style={{ height: 140, background: 'linear-gradient(180deg,#f0fdf4,#fff)', display: 'grid', placeItems: 'center', fontSize: 36 }}>👔</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 10 }}>{s.name}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{s.role}</div>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, padding: '0 14px', wordBreak: 'break-word' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'coops' && (
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px 40px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#052e16' }}>सदस्य संस्थाहरु</h3>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{memberCoops.length}+ member cooperatives across Jhapa & Morang</p>
          <div style={{ marginTop: 14, background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ background: '#052e16', color: '#fff', textAlign: 'left' }}><th style={{ padding: '12px 14px' }}>SN</th><th style={{ padding: '12px 14px' }}>Name</th><th style={{ padding: '12px 14px' }}>Address</th><th style={{ padding: '12px 14px' }}>Contact</th><th style={{ padding: '12px 14px' }}>Representative</th></tr></thead>
                <tbody>
                  {memberCoops.map((r) => (
                    <tr key={r.sn} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{r.sn}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#14532d' }}>{r.name}</td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>{r.address}</td>
                      <td style={{ padding: '10px 14px', color: '#15803d', fontWeight: 700 }}>{r.contact}</td>
                      <td style={{ padding: '10px 14px' }}>{r.rep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

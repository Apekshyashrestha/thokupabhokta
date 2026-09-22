export default function CareerPage() {
  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Career</h2>
          <p>Home / Career</p>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: '24px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 18, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f0fdf4', border: '1px solid #dcfce7', display: 'grid', placeItems: 'center', margin: '0 auto 14px', fontSize: 22 }}>💼</div>
          <h3 style={{ fontWeight: 800, color: '#0f172a' }}>No Openings Right Now</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>We’ll post career opportunities here when available. Stay tuned or email your CV to pradesh1thokupabhokta78@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}

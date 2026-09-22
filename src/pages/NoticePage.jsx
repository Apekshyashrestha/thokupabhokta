export default function NoticePage() {
  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Notice</h2>
          <p>Home / Notice</p>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: '24px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #eef2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a' }}>Notice Board</span>
            <span style={{ fontSize: 11, background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>No new notice</span>
          </div>
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'grid', placeItems: 'center', margin: '0 auto 14px', fontSize: 22 }}>📢</div>
            <h3 style={{ fontWeight: 800, color: '#0f172a' }}>No Openings / Notices Found</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, maxWidth: 520, marginInline: 'auto' }}>There are currently no active notices. For career openings, please check the Career section or contact us at pradesh1thokupabhokta78@gmail.com / 023-585640.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

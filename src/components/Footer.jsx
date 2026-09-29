import { useContent } from "../content/useContent";

export default function Footer() {
  const { siteInfo, footer } = useContent();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>{siteInfo.name}</h4>
          <p style={{ marginBottom: 16 }}>{footer.about}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', padding: '6px 12px', borderRadius: 999 }}>{siteInfo.regNo} • {siteInfo.establishedDate}</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Useful Links</h4>
          <ul>
            {footer.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Info</h4>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">📍</div>
            <div className="footer-contact-text"><span>Address</span>{siteInfo.address} • {siteInfo.regOffice}</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">📞</div>
            <div className="footer-contact-text"><span>Phone</span>{siteInfo.phone} / {siteInfo.altPhone}</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">✉️</div>
            <div className="footer-contact-text"><span>Email</span>{siteInfo.email}</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {footer.copyrightYear} {siteInfo.englishName}. All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <span>{siteInfo.web}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{footer.location}</span>
        </div>
      </div>
    </footer>
  );
}

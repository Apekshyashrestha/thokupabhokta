import React from "react";
import { SITE_INFO, USEFUL_LINKS } from "../data/siteData";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>{SITE_INFO.name}</h4>
          <p style={{ marginBottom: 16 }}>
            कोशी प्रदेश अन्तर्गत रहेका थोक उपभोक्ता विशिष्टीकृत सहकारी संघ लि. यस प्रदेशका साविक मेची, कोशी, सगरमाथा लगायतका विभिन्न जिल्लाहरुबाट उत्पादित वस्तु तथा उपभोग्य खाद्यान्न सामाग्रीहरुको थोक आपूर्ति गर्न स्थापना भएको हो।
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', padding: '6px 12px', borderRadius: 999 }}>{SITE_INFO.regNo} • {SITE_INFO.establishedDate}</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Useful Links</h4>
          <ul>
            {USEFUL_LINKS.map((link, idx) => (
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
            <div className="footer-contact-text"><span>Address</span>{SITE_INFO.address} • {SITE_INFO.regOffice}</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">📞</div>
            <div className="footer-contact-text"><span>Phone</span>{SITE_INFO.phone} / {SITE_INFO.altPhone}</div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon">✉️</div>
            <div className="footer-contact-text"><span>Email</span>{SITE_INFO.email}</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 {SITE_INFO.englishName}. All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <span>{SITE_INFO.web}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Damak-9, Jhapa, Nepal</span>
        </div>
      </div>
    </footer>
  );
}

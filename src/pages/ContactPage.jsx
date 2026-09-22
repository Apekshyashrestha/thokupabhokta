import React from "react";
import { SITE_INFO } from "../data/siteData";

export default function ContactPage() {
  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Contact Us</h2>
          <p>Home / Contact Us</p>
        </div>
      </div>

      <div className="contact-wrap">
        <span className="section-eyebrow">Get in touch</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#052e16', marginTop: 12 }}>Contact Information</h2>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Reach us directly</h3>
            <div className="contact-row">
              <div className="contact-row-icon">📍</div>
              <div><b>Address</b><p>{SITE_INFO.address} — {SITE_INFO.regOffice}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">📞</div>
              <div><b>Phone</b><p>{SITE_INFO.phone} / {SITE_INFO.altPhone}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">✉️</div>
              <div><b>Email</b><p>{SITE_INFO.email}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">🌐</div>
              <div><b>Web & Registration</b><p>{SITE_INFO.web} • Reg No: {SITE_INFO.regNo} • Est. {SITE_INFO.establishedDate}</p></div>
            </div>
          </div>

          <div className="contact-card contact-form">
            <h3>Send a message</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <input placeholder="Your name" />
              <input placeholder="Email address" />
              <input placeholder="Phone number" />
              <textarea rows={4} placeholder="Your message" style={{ resize: 'vertical' }} />
              <button className="btn-readmore" style={{ borderRadius: 12, padding: '12px 18px' }}>Send Message →</button>
              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Demo form — no backend connected yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

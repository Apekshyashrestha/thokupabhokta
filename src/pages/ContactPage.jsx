import { useState } from "react";
import { useContent } from "../content/useContent";
import { db, isConfigured } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const { siteInfo } = useContent();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const handleSend = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) { setStatus("Please fill name, phone and message."); return; }
    setStatus("Sending...");
    try {
      if (isConfigured) {
        await addDoc(collection(db, "enquiries"), { ...form, type: "contact", createdAt: serverTimestamp() });
        setStatus("✅ Message saved to Firebase! We will contact you soon.");
      } else {
        // fallback: open mailto
        const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`);
        window.location.href = `mailto:${siteInfo.email}?subject=Contact%20Enquiry&body=${body}`;
        setStatus("Opening email client (Firebase not configured)...");
      }
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) { setStatus("Failed: " + e.message); }
    setTimeout(() => setStatus(""), 4000);
  };
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
              <div><b>Address</b><p>{siteInfo.address} — {siteInfo.regOffice}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">📞</div>
              <div><b>Phone</b><p>{siteInfo.phone} / {siteInfo.altPhone}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">✉️</div>
              <div><b>Email</b><p>{siteInfo.email}</p></div>
            </div>
            <div className="contact-row">
              <div className="contact-row-icon">🌐</div>
              <div><b>Web & Registration</b><p>{siteInfo.web} • Reg No: {siteInfo.regNo} • Est. {siteInfo.establishedDate}</p></div>
            </div>
          </div>

          <div className="contact-card contact-form">
            <h3>Send a message</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea rows={4} placeholder="Your message" style={{ resize: 'vertical' }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button onClick={handleSend} className="btn-readmore" style={{ borderRadius: 12, padding: '12px 18px' }}>Send Message →</button>
              {status && <p style={{ fontSize: 11, color: status.startsWith('✅') ? '#15803d' : '#dc2626', textAlign: 'center', background: '#f8fafc', padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0' }}>{status}</p>}
              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>{isConfigured ? 'Saved to Firestore → enquiries collection' : 'Demo — configure Firebase to save'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

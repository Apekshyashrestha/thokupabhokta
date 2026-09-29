import { useState } from "react";
import { useContent } from "../content/useContent";
import { db, isConfigured } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProductDetailModal({ product, onClose, related = [] }) {
  const { siteInfo } = useContent();
  const [activeImg, setActiveImg] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", coop: "", qty: "", message: "" });
  const [sent, setSent] = useState(false);

  if (!product) return null;
  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];

  const buildEnquiryText = () => {
    return `Namaste ${siteInfo.name} 🙏\n\nI would like to enquire about:\n• Product: ${product.title}\n• Category: ${product.category}\n• Specs: ${product.specs}\n\nMy details:\nName: ${form.name || "-"}\nPhone: ${form.phone || "-"}\nCooperative/Organization: ${form.coop || "-"}\nQuantity needed: ${form.qty || "-"}\nMessage: ${form.message || "-"}\n\nPlease advise wholesale price, availability & delivery via member cooperatives.\nThank you!`;
  };

  const saveEnquiry = async (via) => {
    if (!isConfigured) return;
    try {
      await addDoc(collection(db, "enquiries"), {
        productId: product.id,
        productTitle: product.title,
        category: product.category,
        name: form.name.trim(),
        phone: form.phone.trim(),
        coop: form.coop.trim(),
        qty: form.qty.trim(),
        message: form.message.trim(),
        via,
        createdAt: serverTimestamp(),
      });
    } catch (e) { console.warn("enquiry save failed", e); }
  };

  const handleWhatsApp = async () => {
    if (!form.name.trim() || !form.phone.trim()) { alert("Please enter your name and phone."); return; }
    await saveEnquiry("whatsapp");
    const text = encodeURIComponent(buildEnquiryText());
    const waNumber = siteInfo.altPhone.replace(/\D/g, "");
    window.open(`https://wa.me/977${waNumber}?text=${text}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleEmail = async () => {
    if (!form.name.trim() || !form.phone.trim()) { alert("Please enter your name and phone."); return; }
    await saveEnquiry("email");
    const subject = encodeURIComponent(`Enquiry: ${product.title} via Cooperatives`);
    const body = encodeURIComponent(buildEnquiryText());
    window.location.href = `mailto:${siteInfo.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleCall = () => {
    window.location.href = `tel:${siteInfo.altPhone}`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(2,18,10,0.62)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 22, maxWidth: 980, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', border: '1px solid #eef2f7' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: 999, background: '#0f172a', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 5, border: 'none' }}>✕</button>

        <div className="modal-grid">
          <div style={{ padding: 18, background: '#f8fafc', borderRight: '1px solid #eef2f7' }} className="modal-grid-left">
            <div style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #eef2f7' }}>
              <img src={gallery[activeImg]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', border: i === activeImg ? '2px solid #22c55e' : '1px solid #e2e8f0', flexShrink: 0, padding: 0 }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <div style={{ marginTop: 14, background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', border: '1px solid #dcfce7', display: 'grid', placeItems: 'center', fontSize: 14 }}>🏬</span>
              <div style={{ fontSize: 11, lineHeight: 1.4 }}>
                <strong style={{ color: '#0f172a' }}>Wholesale via cooperatives</strong><span style={{ display: 'block', color: '#64748b' }}>{siteInfo.address} • {siteInfo.phone} • {siteInfo.altPhone}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: 999, alignSelf: 'flex-start' }}>{product.category}</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 10, lineHeight: 1.2 }}>{product.title}</h2>
            <p style={{ fontSize: 13, color: '#15803d', fontWeight: 700, marginTop: 6, background: '#f8fafc', border: '1px solid #eef2f7', padding: '8px 10px', borderRadius: 10 }}>{product.specs}</p>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, marginTop: 14, whiteSpace: 'pre-wrap' }}>{product.description || product.shortDesc}</p>

            {product.tags && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {product.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 9px', borderRadius: 999, color: '#475569' }}>#{t}</span>
                ))}
              </div>
            )}

            {/* Primary CTA */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowEnquiry(!showEnquiry)} style={{ flex: 1, padding: '12px 14px', borderRadius: 999, background: showEnquiry ? '#0f172a' : 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 13, border: 'none', boxShadow: showEnquiry ? 'none' : '0 8px 20px rgba(34,197,94,0.32)' }}>
                {showEnquiry ? '× Close enquiry form' : 'Enquire via Cooperatives →'}
              </button>
              <button onClick={onClose} style={{ padding: '12px 16px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: 12 }}>Close</button>
            </div>

            {/* Enquiry form — functional */}
            <div style={{ maxHeight: showEnquiry ? 1000 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.25s ease', opacity: showEnquiry ? 1 : 0, marginTop: showEnquiry ? 14 : 0 }}>
              <div style={{ background: 'linear-gradient(180deg,#f8fafc,#ffffff)', border: '1px solid #e2e8f0', borderRadius: 16, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <strong style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a' }}>Send enquiry</strong>
                  <span style={{ fontSize: 11, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 999, fontWeight: 700 }}>Replies via phone/email</span>
                </div>

                <div className="enquiry-grid-2">
                  <label style={{ display: 'grid', gap: 4, fontSize: 11, fontWeight: 700, color: '#334155' }}>Your Name *<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ram Bahadur" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }} /></label>
                  <label style={{ display: 'grid', gap: 4, fontSize: 11, fontWeight: 700, color: '#334155' }}>Phone / WhatsApp *<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98XXXXXXXX" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }} /></label>
                </div>
                <div className="enquiry-grid-2" style={{ marginTop: 10 }}>
                  <label style={{ display: 'grid', gap: 4, fontSize: 11, fontWeight: 700, color: '#334155' }}>Cooperative / Org.<input value={form.coop} onChange={(e) => setForm({ ...form, coop: e.target.value })} placeholder="e.g. Sahara Nepal, Jhapa" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }} /></label>
                  <label style={{ display: 'grid', gap: 4, fontSize: 11, fontWeight: 700, color: '#334155' }}>Qty needed<input value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="e.g. 10 kg / 50 pcs" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }} /></label>
                </div>
                <label style={{ display: 'grid', gap: 4, fontSize: 11, fontWeight: 700, color: '#334155', marginTop: 10 }}>Message<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={`I want wholesale price for ${product.title}...`} rows={3} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff', resize: 'vertical' }} /></label>

                <div className="enquiry-grid-3" style={{ marginTop: 12 }}>
                  <button onClick={handleWhatsApp} style={{ padding: '11px 8px', borderRadius: 999, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 12, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>💬 WhatsApp</button>
                  <button onClick={handleEmail} style={{ padding: '11px 8px', borderRadius: 999, background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: 12, border: 'none' }}>✉️ Email</button>
                  <button onClick={handleCall} style={{ padding: '11px 8px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: 12, color: '#0f172a' }}>📞 Call</button>
                </div>

                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>WhatsApp → {siteInfo.altPhone} • Email → {siteInfo.email} • No login needed</p>

                {sent && (
                  <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#14532d', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                    ✅ Opening your app — your enquiry text is pre-filled with <em>{product.title}</em>. Just hit send!
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 700, padding: '7px 10px', borderRadius: 999, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}>Share Facebook</a>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>• Wholesale at Damak-9, Jhapa • Est. {siteInfo.establishedDate}</span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ padding: 18, borderTop: '1px solid #eef2f7', background: '#fcfdf8' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', marginBottom: 12 }}>Related Products</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {related.slice(0, 3).map((r) => (
                <div key={r.id} style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 14, overflow: 'hidden' }}>
                  <img src={r.image} alt={r.title} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{r.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`.enquiry-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.enquiry-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}@media(max-width:640px){.enquiry-grid-2{grid-template-columns:1fr}.enquiry-grid-3{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { SITE_INFO } from "../data/siteData";
import productpictureImg from "../assets/product-picture.jpg";
import HomeProductSlider from "../components/HomeProductSlider";
import CeoMessageSection from "../components/CeoMessageSection";
import EventsPreview from "../components/EventsPreview";

// Authentic project-related hero images (cooperative / tea / mustard / wholesale)
const HERO_SLIDES = [
  {
    url: "https://thokupabhokta.coop.np/assets/img/slider/slider-2.jpg",
    label: "Kosher Tea Gardens • Ilam",
    fallback: "https://images.unsplash.com/photo-1564890369478-c89ca64c80a1?auto=format&fit=crop&w=1600&q=80",
  },
  {
    url: "https://thokupabhokta.coop.np/assets/img/slider/slider-3.jpg",
    label: "Mustard Fields • Hoklabari, Morang",
    fallback: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80",
  },
  {
    url: "https://thokupabhokta.coop.np/assets/img/slider/slider-4.jpg",
    label: "Cooperative Wholesale • Damak-9, Jhapa",
    fallback: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HomePage({ setActiveTab }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="hero-container">
        {/* Cross-fade slides */}
        {HERO_SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.url}
            alt={s.label}
            className="hero-image"
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 0.82 : 0,
              transition: "opacity 0.9s ease, transform 6s ease",
              transform: i === active ? "scale(1.02)" : "scale(1.08)",
              zIndex: i === active ? 1 : 0,
            }}
            onError={(e) => { e.currentTarget.src = s.fallback; }}
          />
        ))}
        {/* subtle Ken Burns + gradient overlay is in CSS ::after */}
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-badge"><i /> {HERO_SLIDES[active].label}</div>
              <h1 className="hero-heading">
                Wholesale for <em>Cooperatives,</em><br /> Growth for Communities
              </h1>
              <p className="hero-sub">
                {SITE_INFO.englishName} — supplying quality tea, honey, mustard oil &amp; authentic handicrafts across Province 1 through the cooperative network.
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => setActiveTab("products")}>Explore Products →</button>
                <button className="btn-ghost" onClick={() => setActiveTab("about")}>About the Union</button>
              </div>
              {/* dots */}
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      width: i === active ? 28 : 8,
                      height: 8,
                      borderRadius: 999,
                      background: i === active ? "#22c55e" : "rgba(255,255,255,0.55)",
                      border: i === active ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.4)",
                      transition: "0.25s",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>29+</strong><span>Products</span></div>
              <div className="hero-stat"><strong>4</strong><span>Categories</span></div>
              <div className="hero-stat"><strong>2078</strong><span>Established</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-section">
        <div className="welcome-card">
          <div className="welcome-media">
            <img src={productpictureImg} alt="Welcome Product" className="welcome-img" />
            <div className="welcome-badge-float">
              <span style={{ width: 38, height: 38, borderRadius: 10, background: '#f0fdf4', border: '1px solid #dcfce7', display: 'grid', placeItems: 'center' }}>🏬</span>
              <div>
                <strong>Damak-9, Jhapa</strong>
                <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>{SITE_INFO.regOffice}</span>
              </div>
            </div>
          </div>

          <div className="welcome-text">
            <span className="section-eyebrow">Welcome to our Union</span>
            <h2>Welcome To <br /><span>{SITE_INFO.name}</span></h2>
            <p>
              कोशी प्रदेश कार्यक्षेत्र रहेको यस थोक उपभोक्ता विशिष्टिकृत सहकारी संघ लि सहकारी ऐन २०७४ बमोजिम प्रदेश नं १ भर कार्यक्षेत्र रहने गरी समाग्रीहरु थोक आपुर्ति गर्ने, गुणस्तरीय समान आपुर्ति गर्ने विभिन्न उपभोग्य समाग्रीहरु उत्पादन गर्ने र विभिन्न उपभोग्य सामाग्री सर्व सुलभ रुपमा सहकारी मार्फत उपभोक्ताहरु माझ पुर्‍याउनका लागि मिती २०७८ अषाढ ९ मा प्रदेश नं १ सहकारी रजिष्ट्रार कार्यालय ईटहरीमा दर्ता भई स्थापित भएको हो । यसको मुख्य कार्यालय दमक नगरपालिका वडा नं ९ दमकमा रही हाल यसले स्टेशनरीका केहि सामाग्रीहरु, चियाका विभिन्न प्रकारका उत्पादनहरु, मौरीको मह, ताेरीकाे तेल लगायतका सामानहरु विन्नि सहकारी संस्थाहरु मर्फत उपभोक्तामा पुर्‍यानका लागि थोक आपुर्ति गर्न शुरु गरीसकेको छ ।
            </p>
            <div className="welcome-meta">
              <span>📦 Wholesale Supply</span>
              <span>🍯 Tea • Honey • Oil</span>
              <span>🎨 Handicrafts</span>
            </div>
            <button className="btn-readmore" onClick={() => setActiveTab("about")}>
              Read More →
            </button>
          </div>
        </div>
      </div>

      <HomeProductSlider setActiveTab={setActiveTab} />
      <CeoMessageSection />
      <EventsPreview onViewAll={() => { setActiveTab("events"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}

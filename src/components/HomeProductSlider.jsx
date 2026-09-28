import { useState } from "react";
import { ALL_PRODUCTS as STATIC_PRODUCTS } from "../data/productsData";
import { useFirestoreCollection } from "../hooks/useFirestore";
import ProductDetailModal from "./ProductDetailModal";

export default function HomeProductSlider({ setActiveTab }) {
  const { data: ALL_PRODUCTS } = useFirestoreCollection("products", STATIC_PRODUCTS);
  const [selected, setSelected] = useState(null);
  const featured = ALL_PRODUCTS.slice(0, 6);

  return (
    <section className="home-slider-section">
      <div className="home-slider-header">
        <div>
          <span className="section-eyebrow">Featured Collection</span>
          <h3 style={{ marginTop: 10 }}>Our Products at a Glance</h3>
          <p>Curated selection from tea & consumables to handicrafts and agro-machinery — supplied wholesale via cooperatives.</p>
        </div>
        <button
          onClick={() => { setActiveTab("products"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ padding: '9px 14px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}
        >
          View All →
        </button>
      </div>

      {/* Clean grid — no auto-scroll, uniform cards */}
      <div className="home-product-grid">
        {featured.map((product) => (
          <div key={product.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(product)}>
            <div className="product-card-img-wrap" style={{ height: 186 }}>
              <img src={product.image} alt={product.title} className="product-card-img" loading="lazy" />
              <span className="product-card-badge">{product.category}</span>
            </div>
            <div className="product-card-body">
              <h4 className="product-card-title">{product.title}</h4>
              <p className="product-card-specs" style={{ WebkitLineClamp: 2, minHeight: 40 }}>{product.shortDesc || product.specs}</p>
              <span className="btn-read-more">Read More</span>
            </div>
          </div>
        ))}
      </div>

      <div className="view-more-container" style={{ justifyContent: 'center', marginTop: 20 }}>
        <button className="btn-view-more" onClick={() => { setActiveTab("products"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          View All Products
        </button>
      </div>

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          related={ALL_PRODUCTS.filter((p) => p.category === selected.category && p.id !== selected.id)}
        />
      )}
    </section>
  );
}

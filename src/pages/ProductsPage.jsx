import { useState } from "react";
import { ALL_PRODUCTS, CATEGORIES } from "../data/productsData";
import ProductDetailModal from "../components/ProductDetailModal";
import productBannerImg from "../assets/product-picture.jpg";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearAll = () => setSelectedCategories([]);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.shortDesc && product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-banner" style={{ backgroundImage: `url('${productBannerImg}')` }}>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h2>Products</h2>
          <p>Home / Products — {filteredProducts.length} items</p>
        </div>
      </div>

      {/* Mobile chips — visible only on small screens via CSS */}
      <div style={{ maxWidth: 1180, margin: '14px auto 0', padding: '0 14px' }} className="mobile-filter-chips-wrap">
        <div className="mobile-filter-chips">
          <button onClick={clearAll} className={`chip ${selectedCategories.length === 0 ? 'active' : ''}`}>All ({ALL_PRODUCTS.length})</button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`chip ${selectedCategories.includes(cat) ? 'active' : ''}`}
            >
              {cat} {selectedCategories.includes(cat) ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-page-layout">
        <aside className="catalog-sidebar">
          <div className="search-box-wrapper" style={{ marginBottom: 14 }}>
            <input type="text" placeholder="Search products — e.g. honey, tea, brass..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <span className="search-icon-btn">⌕</span>
          </div>

          <h3 className="sidebar-heading">Filter by Category</h3>
          <div className="category-checkbox-list">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="checkbox-label">
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
              </label>
            ))}
          </div>

          {selectedCategories.length > 0 && (
            <button onClick={clearAll} style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 10, background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 800 }}>
              Clear filters ({selectedCategories.length})
            </button>
          )}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{filteredProducts.length} of {ALL_PRODUCTS.length}</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 999 }}>{selectedCategories.length ? `${selectedCategories.length} active` : 'All categories'}</span>
          </div>
        </aside>

        <main className="catalog-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-card-img-wrap" style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                  <img src={p.image} alt={p.title} className="product-card-img" loading="lazy" />
                  <span className="product-card-badge">{p.category}</span>
                </div>
                <div className="product-card-body">
                  <h4 className="product-card-title">{p.title}</h4>
                  <p className="product-card-specs">{p.shortDesc || p.specs}</p>
                  <button className="btn-read-more" onClick={() => setSelected(p)}>Read More</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-msg">
              <div style={{ fontSize: 22, marginBottom: 8 }}>🔍</div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>No products found</h3>
              <p style={{ fontSize: 12, marginTop: 4 }}>Try a different search or clear filters.</p>
              <button onClick={() => { setSearchTerm(""); clearAll(); }} style={{ marginTop: 12, padding: '8px 14px', borderRadius: 999, background: '#052e16', color: '#fff', fontWeight: 700, fontSize: 12 }}>Reset all</button>
            </div>
          )}
        </main>
      </div>

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          related={ALL_PRODUCTS.filter((x) => x.category === selected.category && x.id !== selected.id)}
        />
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useContent } from "../content/useContent";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { SelectField, TextArea, TextField } from "./Field";
import MediaField from "./MediaField";
import { describeWriteError, fromTags, nextNumericId, removeDocument, saveDocument, toTags } from "./adminUtils";

const emptyProduct = (category) => ({
  title: "",
  category: category || "",
  shortDesc: "",
  specs: "",
  description: "",
  tags: "",
  image: "",
  gallery: [],
});

export default function ProductManager() {
  const { categories } = useContent();
  const { rows, loading, error } = useAdminCollection("products");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyProduct());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const sorted = useMemo(
    () => [...rows].sort((a, b) => Number(a.id || 0) - Number(b.id || 0)),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (p) =>
        String(p.title || "").toLowerCase().includes(q) || String(p.category || "").toLowerCase().includes(q),
    );
  }, [sorted, search]);

  const startNew = () => {
    setForm(emptyProduct(categories[0]));
    setEditing("new");
    setStatus(null);
  };

  const startEdit = (row) => {
    setForm({
      title: row.title || "",
      category: row.category || categories[0] || "",
      shortDesc: row.shortDesc || "",
      specs: row.specs || "",
      description: row.description || "",
      tags: fromTags(row.tags),
      image: row.image || "",
      gallery: Array.isArray(row.gallery) ? row.gallery.filter(Boolean) : row.gallery ? [row.gallery] : [],
    });
    setEditing(row);
    setStatus(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Product title is required." });
      return;
    }
    const id = editing === "new" ? nextNumericId(rows) : Number(editing.id) || editing.id;
    setBusy(true);
    setStatus(null);
    try {
      const gallery = form.gallery.length ? form.gallery : form.image ? [form.image] : [];
      await saveDocument("products", id, {
        id: Number(id) || id,
        title: form.title.trim(),
        category: form.category,
        shortDesc: form.shortDesc.trim(),
        specs: form.specs.trim(),
        description: form.description.trim(),
        tags: toTags(form.tags),
        image: form.image,
        gallery,
      });
      setStatus({ type: "success", message: "Product saved." });
      setEditing(null);
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setStatus(null);
    try {
      await removeDocument("products", row.id);
      setStatus({ type: "success", message: "Product deleted." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  if (editing) {
    return (
      <div className="adm-editor">
        <div className="adm-editor-head">
          <h3>{editing === "new" ? "New product" : `Editing #${editing.id}`}</h3>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>
            Back to list
          </button>
        </div>

        <div className="adm-grid-2">
          <TextField label="Title" required value={form.title} onChange={set("title")} />
          <SelectField label="Category" required value={form.category} onChange={set("category")} options={categories} />
        </div>

        <TextField
          label="Short description"
          value={form.shortDesc}
          onChange={set("shortDesc")}
          hint="One or two lines shown on the product card."
        />
        <TextField label="Specifications" value={form.specs} onChange={set("specs")} />
        <TextArea label="Full description" value={form.description} onChange={set("description")} rows={6} />
        <TextField label="Tags" value={form.tags} onChange={set("tags")} hint="Comma separated, e.g. Honey, Health, Raw" />

        <MediaField
          label="Main image"
          folder="uploads/products"
          value={form.image ? [form.image] : []}
          onChange={(arr) => setForm((f) => ({ ...f, image: arr[arr.length - 1] || "" }))}
        />
        <MediaField
          label="Gallery"
          multiple
          folder="uploads/products"
          value={form.gallery}
          onChange={(arr) => setForm((f) => ({ ...f, gallery: arr }))}
          hint="Optional extra photos used in the product detail slider."
        />

        {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}

        <div className="adm-editor-actions">
          <button type="button" className="adm-btn adm-btn-primary" disabled={busy} onClick={handleSave}>
            {busy ? "Saving..." : "Save product"}
          </button>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="adm-toolbar">
        <input
          className="adm-input adm-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="adm-btn adm-btn-primary" onClick={startNew}>
          + Add product
        </button>
      </div>

      {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}
      {error && <p className="adm-error">Could not load products: {error.message}</p>}
      {loading && <p className="adm-hint">Loading products...</p>}
      {!loading && !filtered.length && (
        <p className="adm-empty">No products found. Add your first product to publish it on the website.</p>
      )}

      <div className="adm-list">
        {filtered.map((p) => (
          <div className="adm-list-row" key={p.id}>
            <div className="adm-thumb">
              {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span>No image</span>}
            </div>
            <div className="adm-list-main">
              <strong>{p.title}</strong>
              <span className="adm-meta">
                #{p.id} · {p.category || "Uncategorised"}
                {Array.isArray(p.tags) && p.tags.length ? ` · ${p.tags.join(", ")}` : ""}
              </span>
            </div>
            <div className="adm-list-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDelete(p)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

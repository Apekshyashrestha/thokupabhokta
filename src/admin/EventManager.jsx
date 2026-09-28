import { useMemo, useState } from "react";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { TextArea, TextField } from "./Field";
import MediaField from "./MediaField";
import { describeWriteError, removeDocument, saveDocument } from "./adminUtils";

const EMPTY = { title: "", date: "", image: "", excerpt: "", full: "" };

const longDate = (iso) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const toSortKey = (row) => {
  if (row.sortDate) return new Date(row.sortDate).getTime();
  const parsed = new Date(row.date || "");
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export default function EventManager() {
  const { rows, loading, error } = useAdminCollection("events");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [sortDate, setSortDate] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const sorted = useMemo(() => [...rows].sort((a, b) => toSortKey(b) - toSortKey(a)), [rows]);

  const startNew = () => {
    setForm(EMPTY);
    setSortDate("");
    setEditing("new");
    setStatus(null);
  };

  const startEdit = (row) => {
    setForm({
      title: row.title || "",
      date: row.date || "",
      image: row.image || "",
      excerpt: row.excerpt || "",
      full: row.full || "",
    });
    setSortDate(row.sortDate ? String(row.sortDate).slice(0, 10) : "");
    setEditing(row);
    setStatus(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Event title is required." });
      return;
    }
    const id = editing === "new" ? Date.now().toString(36) : editing.id;
    setBusy(true);
    setStatus(null);
    try {
      await saveDocument("events", id, {
        title: form.title.trim(),
        date: sortDate ? longDate(sortDate) : form.date.trim(),
        sortDate: sortDate || null,
        image: form.image,
        excerpt: form.excerpt.trim(),
        full: form.full.trim(),
      });
      setStatus({ type: "success", message: "Event saved." });
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
      await removeDocument("events", row.id);
      setStatus({ type: "success", message: "Event deleted." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  if (editing) {
    return (
      <div className="adm-editor">
        <div className="adm-editor-head">
          <h3>{editing === "new" ? "New event" : "Editing event"}</h3>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>
            Back to list
          </button>
        </div>

        <TextField label="Title" required value={form.title} onChange={set("title")} />
        <div className="adm-grid-2">
          <TextField
            label="Event date"
            type="date"
            value={sortDate}
            onChange={setSortDate}
            hint="Used to order events newest first."
          />
          <TextField
            label="Display date (optional)"
            value={form.date}
            onChange={set("date")}
            hint="Leave blank to use the date above. Example: December 18, 2025"
          />
        </div>

        <TextArea
          label="Short excerpt"
          value={form.excerpt}
          onChange={set("excerpt")}
          rows={3}
          hint="Shown on the events preview card."
        />
        <TextArea label="Full news text" value={form.full} onChange={set("full")} rows={8} />

        <MediaField
          label="Event image"
          folder="uploads/events"
          value={form.image ? [form.image] : []}
          onChange={(arr) => setForm((f) => ({ ...f, image: arr[arr.length - 1] || "" }))}
        />

        {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}

        <div className="adm-editor-actions">
          <button type="button" className="adm-btn adm-btn-primary" disabled={busy} onClick={handleSave}>
            {busy ? "Saving..." : "Save event"}
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
        <span className="adm-hint">{sorted.length} events, newest first</span>
        <button type="button" className="adm-btn adm-btn-primary" onClick={startNew}>
          + Add event
        </button>
      </div>

      {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}
      {error && <p className="adm-error">Could not load events: {error.message}</p>}
      {loading && <p className="adm-hint">Loading events...</p>}
      {!loading && !sorted.length && <p className="adm-empty">No events yet. Add one to publish it on the website.</p>}

      <div className="adm-list">
        {sorted.map((e) => (
          <div className="adm-list-row" key={e.id}>
            <div className="adm-thumb">
              {e.image ? <img src={e.image} alt="" loading="lazy" /> : <span>No image</span>}
            </div>
            <div className="adm-list-main">
              <strong>{e.title}</strong>
              <span className="adm-meta">{e.date || "No date"}</span>
            </div>
            <div className="adm-list-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(e)}>
                Edit
              </button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDelete(e)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

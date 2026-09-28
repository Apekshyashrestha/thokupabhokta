import { useMemo, useState } from "react";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { TextField } from "./Field";
import MediaField from "./MediaField";
import { describeWriteError, removeDocument, saveDocument } from "./adminUtils";

const EMPTY = { title: "", publishedDate: "", file: "", size: "", type: "PDF" };

const toInputDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const longDate = (iso) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function ReportManager() {
  const { rows, loading, error } = useAdminCollection("reports");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [published, setPublished] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const ta = new Date(a.publishedDate || 0).getTime() || 0;
        const tb = new Date(b.publishedDate || 0).getTime() || 0;
        if (tb !== ta) return tb - ta;
        return Number(b.id || 0) - Number(a.id || 0);
      }),
    [rows],
  );

  const startNew = () => {
    setForm(EMPTY);
    setPublished("");
    setEditing("new");
    setStatus(null);
  };

  const startEdit = (row) => {
    setForm({
      title: row.title || "",
      publishedDate: row.publishedDate || "",
      file: row.file || "",
      size: row.size || "",
      type: row.type || "PDF",
    });
    setPublished(toInputDate(row.publishedDate));
    setEditing(row);
    setStatus(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Report title is required." });
      return;
    }
    if (!form.file) {
      setStatus({ type: "error", message: "Please upload a file or paste the report URL." });
      return;
    }
    const maxId = rows.reduce((acc, r) => {
      const n = Number(r.id);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    const id = editing === "new" ? maxId + 1 : editing.id;
    setBusy(true);
    setStatus(null);
    try {
      await saveDocument("reports", id, {
        id: Number(id) || id,
        title: form.title.trim(),
        publishedDate: published ? longDate(published) : form.publishedDate.trim(),
        file: form.file,
        size: form.size.trim() || "—",
        type: form.type.trim() || "PDF",
      });
      setStatus({ type: "success", message: "Report saved." });
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
      await removeDocument("reports", row.id);
      setStatus({ type: "success", message: "Report deleted." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  if (editing) {
    return (
      <div className="adm-editor">
        <div className="adm-editor-head">
          <h3>{editing === "new" ? "New report" : `Editing #${editing.id}`}</h3>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>
            Back to list
          </button>
        </div>

        <TextField label="Title" required value={form.title} onChange={set("title")} />
        <div className="adm-grid-2">
          <TextField label="Published date" type="date" value={published} onChange={setPublished} />
          <TextField
            label="File size"
            value={form.size}
            onChange={set("size")}
            placeholder="2.4 MB"
            hint="Displayed next to the download link."
          />
        </div>

        <MediaField
          label="Report file (PDF)"
          accept="application/pdf"
          folder="uploads/reports"
          value={form.file ? [form.file] : []}
          onChange={(arr) => setForm((f) => ({ ...f, file: arr[arr.length - 1] || "" }))}
          hint="Upload the PDF here, or paste a link to a file hosted elsewhere."
        />

        {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}

        <div className="adm-editor-actions">
          <button type="button" className="adm-btn adm-btn-primary" disabled={busy} onClick={handleSave}>
            {busy ? "Saving..." : "Save report"}
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
        <span className="adm-hint">{sorted.length} reports</span>
        <button type="button" className="adm-btn adm-btn-primary" onClick={startNew}>
          + Add report
        </button>
      </div>

      {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}
      {error && <p className="adm-error">Could not load reports: {error.message}</p>}
      {loading && <p className="adm-hint">Loading reports...</p>}
      {!loading && !sorted.length && <p className="adm-empty">No reports yet.</p>}

      <div className="adm-list">
        {sorted.map((r) => (
          <div className="adm-list-row" key={r.id}>
            <div className="adm-thumb adm-thumb-pdf">
              <span>{r.type || "PDF"}</span>
            </div>
            <div className="adm-list-main">
              <strong>{r.title}</strong>
              <span className="adm-meta">
                {r.publishedDate || "No date"} · {r.size || "size unknown"}
              </span>
            </div>
            <div className="adm-list-actions">
              {r.file && (
                <a className="adm-btn adm-btn-ghost" href={r.file} target="_blank" rel="noreferrer">
                  Open
                </a>
              )}
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(r)}>
                Edit
              </button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDelete(r)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

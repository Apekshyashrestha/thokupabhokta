import { useState } from "react";
import { CONTENT_BLOCKS } from "./contentSchema";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { useContent } from "../content/useContent";
import { TextArea, TextField } from "./Field";
import MediaField from "./MediaField";
import RecordListField from "./RecordListField";
import { describeWriteError, removeDocument, saveDocument } from "./adminUtils";

const toLines = (value) => (Array.isArray(value) ? value.join("\n") : String(value ?? ""));
const toList = (text) =>
  String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function FieldControl({ field, value, onChange }) {
  if (field.type === "textarea") {
    return <TextArea label={field.label} rows={field.rows || 4} value={value} onChange={onChange} hint={field.hint} />;
  }
  if (field.type === "text") {
    return <TextField label={field.label} value={value} onChange={onChange} hint={field.hint} />;
  }
  if (field.type === "image") {
    return (
      <MediaField
        label={field.label}
        folder="uploads/content"
        value={value ? [value] : []}
        onChange={(arr) => onChange(arr[arr.length - 1] || "")}
        hint={field.hint || "Paste an image URL, or upload if you have enabled Firebase Storage."}
      />
    );
  }
  if (field.type === "records") {
    return (
      <RecordListField
        label={field.label}
        value={value}
        onChange={onChange}
        subFields={field.subFields}
        newRow={field.newRow}
        hint={field.hint}
      />
    );
  }
  if (field.type === "lines") {
    return (
      <TextArea
        label={field.label}
        rows={8}
        value={toLines(value)}
        onChange={(text) => onChange(toList(text))}
        hint={field.hint || "One item per line."}
      />
    );
  }
  return null;
}

export default function ContentManager() {
  const defaults = useContent();
  const { rows, loading } = useAdminCollection("content");
  const [active, setActive] = useState(CONTENT_BLOCKS[0].id);
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const stored = Object.fromEntries(rows.map((r) => [r.id, r]));
  const block = CONTENT_BLOCKS.find((b) => b.id === active) || CONTENT_BLOCKS[0];
  const saved = stored[block.id];
  const isSaved = Boolean(saved);

  const current = () => (draft && draft.blockId === block.id ? draft.values : defaults[block.id]);

  const setValue = (key, value, isRoot) =>
    setDraft((d) => {
      const base = d && d.blockId === block.id ? d.values : defaults[block.id];
      if (isRoot) return { blockId: block.id, values: value };
      return { blockId: block.id, values: { ...base, [key]: value } };
    });

  const handleSave = async () => {
    const values = { ...(draft && draft.blockId === block.id ? draft.values : defaults[block.id]) };
    delete values.id;
    delete values.updatedAt;
    setBusy(true);
    setStatus(null);
    try {
      await saveDocument("content", block.id, values);
      setDraft(null);
      setStatus({ type: "success", message: `Saved "${block.label}". The website updates immediately.` });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    } finally {
      setBusy(false);
    }
  };

  const handleRevert = async () => {
    if (!window.confirm(`Delete the saved "${block.label}" content and restore the built-in text?`)) return;
    setBusy(true);
    setStatus(null);
    try {
      await removeDocument("content", block.id);
      setDraft(null);
      setStatus({ type: "success", message: "Restored the built-in text." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    } finally {
      setBusy(false);
    }
  };

  const values = current();

  return (
    <div>
      <div className="adm-tabs adm-tabs-wrap">
        {CONTENT_BLOCKS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`adm-tab ${active === b.id ? "is-active" : ""}`}
            onClick={() => {
              setActive(b.id);
              setDraft(null);
              setStatus(null);
            }}
          >
            <span aria-hidden="true">{b.icon}</span>
            {b.label}
            {stored[b.id] && <span className="adm-tab-dot" title="Edited" />}
          </button>
        ))}
      </div>

      <p className="adm-blurb">{block.blurb}</p>
      {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}
      {loading && <p className="adm-hint">Loading saved content...</p>}

      <div className="adm-editor">
        {block.groups.map((group) => (
          <div className="adm-group" key={group.label}>
            <h4 className="adm-group-title">{group.label}</h4>
            {group.fields.map((field) => {
              const value = field.isRoot ? values : values?.[field.key];
              const onChange = (v) => setValue(field.key, v, field.isRoot);
              return <FieldControl key={field.key} field={field} value={value} onChange={onChange} />;
            })}
          </div>
        ))}

        <div className="adm-editor-actions">
          <button type="button" className="adm-btn adm-btn-primary" disabled={busy} onClick={handleSave}>
            {busy ? "Saving..." : `Save ${block.label}`}
          </button>
          {isSaved && (
            <button type="button" className="adm-btn adm-btn-ghost" disabled={busy} onClick={handleRevert}>
              Revert to built-in text
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

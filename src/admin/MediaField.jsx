import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isConfigured, storage } from "../firebase";

const MAX_BYTES = 5 * 1024 * 1024;

function cleanName(name) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const safeBase = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  const safeExt = ext.replace(/[^a-z0-9.]/g, "");
  return `${safeBase || "file"}${safeExt}`;
}

function describeUploadError(e) {
  const code = e?.code || "";
  if (code === "storage/unauthorized") {
    return "Storage rejected the upload: your signed-in email is not in the allowed list. Update storage.rules and your admin email.";
  }
  if (code === "storage/unauthenticated" || code === "auth/unauthenticated") {
    return "Storage requires sign-in. Please log in to the admin panel again.";
  }
  if (code === "storage/retry-limit-exceeded" || code === "storage/unavailable") {
    return "Storage is not reachable. If you just enabled Storage, deploy the rules in storage.rules and try again.";
  }
  if (code === "storage/canceled" || code === "storage/object-not-found") {
    return "Storage bucket is not set up. Enable it in the Firebase console, or paste an image URL below instead.";
  }
  if (code === "storage/unknown" || code === "storage/internal-error") {
    return "Storage is not enabled for this project yet. Paste a URL below, or enable Storage in the Firebase console.";
  }
  return e?.message || "Upload failed.";
}

export default function MediaField({
  label,
  value = [],
  onChange,
  multiple = false,
  accept = "image/*",
  folder = "uploads/products",
  hint,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pasted, setPasted] = useState("");
  const items = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setError("");

    if (!isConfigured || !storage) {
      setError("Storage is not configured. Paste a URL below instead.");
      return;
    }

    const tooBig = files.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than 5 MB. Please compress it first.`);
      return;
    }

    setBusy(true);
    const uploaded = [];
    try {
      for (const file of files) {
        const token = crypto.randomUUID().slice(0, 8);
        const path = `${folder}/${token}-${cleanName(file.name)}`;
        const objectRef = ref(storage, path);
        await uploadBytes(objectRef, file);
        uploaded.push(await getDownloadURL(objectRef));
      }
      onChange(multiple ? [...items, ...uploaded] : uploaded.slice(-1));
    } catch (e) {
      setError(describeUploadError(e));
    } finally {
      setBusy(false);
    }
  };

  const addPasted = () => {
    const url = pasted.trim();
    if (!url) return;
    onChange(multiple ? [...items, url] : [url]);
    setPasted("");
  };

  const removeAt = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="adm-field">
      <label className="adm-label">
        {label}
        {multiple && <span className="adm-label-hint">(multiple)</span>}
      </label>

      {items.length > 0 && (
        <div className="adm-media-grid">
          {items.map((url, i) => (
            <div className="adm-media-item" key={`${url}-${i}`}>
              {/\.(pdf)(\?|$)/i.test(url) || accept === "application/pdf" ? (
                <span className="adm-media-pdf">PDF</span>
              ) : (
                <img src={url} alt="" loading="lazy" />
              )}
              <button type="button" className="adm-media-remove" onClick={() => removeAt(i)} aria-label="Remove">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="adm-media-actions">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFiles}
          style={{ display: "none" }}
        />
        <button type="button" className="adm-btn adm-btn-ghost" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Uploading..." : multiple ? "Upload files" : "Upload file"}
        </button>
        <span className="adm-hint">or</span>
        <input
          className="adm-input adm-input-sm"
          placeholder="Paste image / PDF URL"
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPasted();
            }
          }}
        />
        <button type="button" className="adm-btn adm-btn-ghost" onClick={addPasted} disabled={!pasted.trim()}>
          Add URL
        </button>
      </div>

      {hint && <p className="adm-hint adm-hint-block">{hint}</p>}
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
}
